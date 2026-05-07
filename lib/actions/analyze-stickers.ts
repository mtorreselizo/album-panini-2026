"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

FORMATO DE LOS CÓDIGOS:
- Código de país en mayúsculas + número pegado, sin espacio.
- Ejemplos: GER1, GER2, MEX14, ARG10, BRA5, FWC1, USA20, FRA3.
- Las letras son 2–3 caracteres. El número va del 1 al 30.

INSTRUCCIONES:
1. Lee todos los códigos visibles.
2. Si un código aparece en varias estampas físicas distintas en la misma foto (por ejemplo, hay dos estampas "GER1"), DEBES INCLUIRLO MÚLTIPLES VECES, una vez por cada estampa física. No agrupes las repetidas.
3. Ignora el logo de FIFA, el logo de PANINI, y cualquier texto legal pequeño.

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
              text: "Identifica todos los códigos de las estampas y devuelve el JSON. Asegúrate de incluir las estampas repetidas si aparecen más de una vez en la foto.",
            },
            ...imageContent,
          ],
        },
      ],
      response_format: { type: "json_object" },
    }, {
      signal: AbortSignal.timeout(45000), // 45 second timeout for 4 images
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

    // Transform to simple string array and sort alphabetically ascending
    const stickers = (parsed.estampas || [])
      .map((item: any) => `${item.pais}${item.numero}`.toUpperCase().replace(/\s+/g, ''))
      .filter((s: string) => s.length > 0)
      .sort((a: string, b: string) => a.localeCompare(b));

    console.log(`[analyzeStickers] Detected ${stickers.length} stickers:`, stickers);
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
