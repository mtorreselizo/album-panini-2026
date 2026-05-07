"use server";

import OpenAI from "openai";
import { teams } from "../album-data";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const VALID_CODES = teams.map(t => t.code);
VALID_CODES.push("FWC", "00");

export async function analyzeStickers(base64Images: string[]) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  try {
    // Build image content entries — one per rotation (0°, 90°, 180°, 270°)
    const imageContent = base64Images.map((b64, i) => ({
      type: "image_url" as const,
      image_url: {
        url: `data:image/jpeg;base64,${b64}`,
        detail: "high" as const,
      },
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-5.4-mini",
      messages: [
        {
          role: "system",
          content: `Eres un sistema OCR especializado en estampas Panini del Mundial 2026.

Tu tarea es leer los códigos impresos en el REVERSO (lado blanco con texto) de cada estampa visible en la imagen.

CÓDIGOS DE PAÍS VÁLIDOS (ESTRICTO):
${VALID_CODES.join(", ")}

FORMATO DE LOS CÓDIGOS:
- Código de país en mayúsculas (DE LA LISTA ANTERIOR) + número pegado, sin espacio.
- Para países, el número va del 1 al 20.
- Para "FWC", el número va del 1 al 19.
- El código especial "00" no lleva número.

INSTRUCCIONES Y MANEJO DE ROTACIÓN:
1. Lee todos los códigos visibles.
2. Las estampas pueden estar rotadas en CUALQUIER ángulo (45°, 90°, 180°, etc). ¡Ten mucho cuidado! Una "M" de cabeza parece "W", una "E" rotada parece "M" o "W", un "6" rotado parece "9". 
3. OBLIGATORIO: Compara lo que lees con la LISTA DE CÓDIGOS VÁLIDOS. Si lees algo parecido a "FRA" pero está rotado, asegúrate de que sea "FRA" y no otra cosa. Nunca inventes un país que no esté en la lista.
4. Si un código aparece en varias estampas físicas distintas en la misma foto (por ejemplo, hay dos estampas "GER1"), DEBES INCLUIRLO MÚLTIPLES VECES, una vez por cada estampa física. No agrupes las repetidas.
5. Ignora el logo de FIFA, el logo de PANINI, y cualquier texto legal.

FORMATO DE SALIDA (JSON estricto, sin texto extra):
{
  "conteo_total": <número>,
  "estampas": [
    {"pais": "GER", "numero": 1},
    {"pais": "GER", "numero": 1},
    {"pais": "MEX", "numero": 14}
  ]
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identifica todos los códigos de las estampas y devuelve el JSON. Asegúrate de incluir las repetidas y usa SOLO los códigos de país válidos.",
            },
            ...imageContent,
          ],
        },
      ],
      response_format: { type: "json_object" },
    }, {
      signal: AbortSignal.timeout(45000), // 45 second timeout
    });

    const rawContent = response.choices[0]?.message?.content;
    console.log("[analyzeStickers] Raw OpenAI response:", rawContent);

    if (!rawContent) {
      throw new Error("OpenAI no devolvió ningún contenido. Intenta de nuevo.");
    }

    let parsed: any;
    try {
      parsed = JSON.parse(rawContent);
    } catch {
      console.error("[analyzeStickers] JSON parse failed. Content:", rawContent);
      throw new Error("La respuesta de OpenAI no es un JSON válido. Intenta de nuevo.");
    }

    // Transform to simple string array, filter valid codes, and sort
    const stickers = (parsed.estampas || [])
      .map((item: any) => {
        const p = (item.pais || "").toUpperCase();
        const n = item.numero !== undefined && item.numero !== null ? String(item.numero) : "";
        return `${p}${n}`.replace(/\s+/g, "");
      })
      .filter((s: string) => {
        if (s === "00") return true;
        const match = s.match(/^([A-Z]{3}|FWC)(\d+)$/);
        if (!match) return false;
        
        const code = match[1];
        const num = parseInt(match[2], 10);
        
        // Strict validation
        if (!VALID_CODES.includes(code)) return false;
        if (code === "FWC" && (num < 1 || num > 19)) return false;
        if (code !== "FWC" && (num < 1 || num > 20)) return false;
        
        return true;
      })
      .sort((a: string, b: string) => a.localeCompare(b));

    console.log(`[analyzeStickers] Detected ${stickers.length} VALID stickers:`, stickers);
    return stickers;
  } catch (error: any) {
    console.error("OpenAI Analysis Error:", error);

    if (error.status === 401) {
      throw new Error("Error de autenticación: La API Key de OpenAI es inválida.");
    }
    if (error.status === 429) {
      throw new Error("Límite de cuota excedido: Revisa tu plan de OpenAI.");
    }
    if (error.status === 413) {
      throw new Error("Imagen demasiado grande para procesar.");
    }

    throw new Error(error.message || "No se pudo analizar la imagen. Intenta de nuevo.");
  }
}
