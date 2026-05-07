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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres un sistema OCR especializado en estampas Panini del Mundial 2026.

Te voy a enviar UNA imagen que contiene un collage 2×2: la misma foto de estampas rotada a 0°, 90°, 180° y 270°. Revisa LOS CUATRO cuadrantes para capturar estampas en cualquier orientación.

FORMATO DE LOS CÓDIGOS:
- Estampas de equipos: código de país en MAYÚSCULAS seguido directamente del número sin espacio (ej: MEX14, ARG10, BRA1, USA20, GER3, FWC1, FWC25).
- Las letras suelen ser de 2 a 3 caracteres (ej: ARG, MEX, BRA, FWC, GER, FRA, ESP).
- El número va de 1 a 30 aproximadamente.

REGLAS:
1. Busca el código en los CUATRO cuadrantes de la imagen.
2. Si el mismo código aparece en múltiples cuadrantes (por la rotación), inclúyelo UNA SOLA VEZ.
3. Ignora texto como 'FIFA', 'PANINI', 'OFFICIAL', marcas de agua, o cualquier texto que no sea un código de estampa.
4. Si una estampa está parcialmente visible pero su código es legible, inclúyela.

FORMATO DE SALIDA (JSON estricto):
{
  "conteo_total": <número entero>,
  "estampas": [
    {"pais": "MEX", "numero": 14},
    {"pais": "ARG", "numero": 10}
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
