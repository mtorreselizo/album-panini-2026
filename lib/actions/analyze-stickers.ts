"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeStickers(base64Image: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
1. Lee el código impreso en cada estampa, aunque estén rotadas, de lado o de cabeza.
2. Ignora el logo de FIFA, el logo de PANINI, y cualquier texto legal pequeño.
3. Si el código es parcialmente visible pero legible, inclúyes.
4. Devuelve cada código una sola vez aunque aparezca en varias estampas.

FORMATO DE SALIDA (JSON estricto, sin texto extra):
{
  "conteo_total": <número>,
  "estampas": [
    {"pais": "GER", "numero": 1},
    {"pais": "GER", "numero": 2}
  ]
}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identifica todas las estampas Panini en esta imagen, sin importar su orientación. Devuelve el JSON solicitado."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    }, {
      signal: AbortSignal.timeout(30000), // 30 second timeout
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

    // Transform the new structure back to the simple string array the app expects
    const stickers = (parsed.estampas || [])
      .map((item: any) => `${item.pais}${item.numero}`.toUpperCase().replace(/\s+/g, ''))
      .filter((s: string) => s.length > 0);

    console.log(`[analyzeStickers] Detected ${stickers.length} stickers:`, stickers);
    return stickers;
  } catch (error: any) {
    console.error("OpenAI Analysis Error:", error);
    
    // Handle specific OpenAI errors
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
