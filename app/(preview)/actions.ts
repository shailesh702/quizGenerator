"use server";

// import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

export const generateQuizTitle = async (file: string) => {
  console.log("file ==> ", file)
  const result = await generateObject({
    model: google("gemini-1.5-flash-latest"),
    schema: z.object({
      title: z
        .string()
        .describe(
          "A max three word title for the quiz based on the file provided as context",
        ),
    }),
    prompt:
      "Generate a title for a quiz based on the following (PDF) file name. Try and extract as much info from the file name as possible. If the file name is just numbers or incoherent, just return quiz.\n\n " + file,
  });
  console.log("Result in actions.ts ==> ", result)
  return result.object.title;
};
