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
          content: `Eres un experto en visión artificial para coleccionables. Tu tarea es extraer códigos de estampas Panini de una imagen.

          INSTRUCCIONES:
          1. Analiza TODA la imagen. Las estampas pueden estar en cualquier orientación (rotadas 90°, 180°, o en diagonal) y pueden estar encimadas.
          2. Busca el patrón: Código de País (3 letras mayúsculas) seguido de un espacio y el Número de la estampa (ej. ARG 10, GER 3).
          3. Ignora cualquier otro texto como 'FIFA', 'OFFICIAL LICENSED PRODUCT' o 'PANINI'.
          4. Si una estampa es parcialmente visible pero el código y número son legibles, inclúyela.

          FORMATO DE SALIDA:
          Devuelve únicamente un objeto JSON con la siguiente estructura, sin texto adicional:
          {
            "conteo_total": [número de estampas detectadas],
            "estampas": [
              {"pais": "COD", "numero": X},
              {"pais": "COD", "numero": Y}
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
    });

    const content = response.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);
    
    // Transform the new structure back to the simple string array the app expects
    const stickers = (parsed.estampas || [])
      .map((item: any) => `${item.pais}${item.numero}`.toUpperCase().replace(/\s+/g, ''))
      .filter((s: string) => s.length > 0);

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
