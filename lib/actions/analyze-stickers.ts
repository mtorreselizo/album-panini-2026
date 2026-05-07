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
          content: `Eres un experto en el álbum Panini de la Copa Mundial 2026. 
          Tu tarea es identificar los códigos de las estampas en la imagen. 
          
          REGLAS CRÍTICAS:
          1. Los códigos tienen formato: [PAÍS][NÚMERO] (ej. MEX14, ARG10, BRA1) o FWC[NÚMERO] (ej. FWC1).
          2. IMPORTANTE: Las estampas pueden estar rotadas, de lado o de cabeza. Analiza la imagen desde todas las orientaciones posibles para encontrar los códigos.
          3. Responde EXCLUSIVAMENTE en formato JSON con la siguiente estructura: {"stickers": ["CODIGO1", "CODIGO2"]}`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identifica todas las estampas Panini en esta imagen, sin importar su orientación. Devuelve el JSON con los códigos."
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
    const stickers = (parsed.stickers || [])
      .map((s: string) => s.trim().toUpperCase())
      .filter((s: string) => s.length > 0);

    return stickers;
  } catch (error) {
    console.error("Error analyzing stickers:", error);
    throw new Error("No se pudo analizar la imagen. Intenta de nuevo.");
  }
}
