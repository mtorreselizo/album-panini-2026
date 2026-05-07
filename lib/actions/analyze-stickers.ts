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
          content: "Eres un experto en el álbum Panini de la Copa Mundial 2026. Tu tarea es identificar los códigos de las estampas en la imagen proporcionada. Los códigos suelen tener un formato de 3 letras del país seguidas de un número (ej. MEX14, ARG10, BRA1, USA20) o FWC seguido de un número (ej. FWC1, FWC25). Responde EXCLUSIVAMENTE con una lista de códigos separados por comas, sin texto adicional."
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Identifica todas las estampas Panini en esta imagen. Devuelve solo los códigos (ej. MEX14, FWC2) separados por comas."
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
    });

    const content = response.choices[0]?.message?.content || "";
    // Clean up the response and split into an array
    const stickers = content
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter((s) => s.length > 0);

    return stickers;
  } catch (error) {
    console.error("Error analyzing stickers:", error);
    throw new Error("No se pudo analizar la imagen. Intenta de nuevo.");
  }
}
