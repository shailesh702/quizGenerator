import { questionSchema, questionsSchema } from "@/lib/schemas";
// import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { CHAUCER_CONTENT, CHAUCER_base64Data  } from "../../../constants/chaucer_content";
export const maxDuration = 60;

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export async function POST(req: Request) {
  const { files } = await req.json();
  console.log("files in route.js ==> ", files);
  // const firstFile = files[0].data;

  const result = streamObject({
    model: google("gemini-1.5-pro-latest"),
    messages: [
      {
        role: "system",
        content:
          "You are a teacher. Your job is to take a document, and create a multiple choice test (with 4 questions) based on the content of the document. Each option should be roughly equal in length.",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Create a multiple choice test based on this document.",
          },
          {
            type: "file",
            data: CHAUCER_base64Data,
            mimeType: "text/plain",
          },
        ],
      },
    ],
    schema: questionSchema,
    output: "array",
    onFinish: ({ object }) => {
      console.log("value of Object ==> ", object)
      const res = questionsSchema.safeParse(object);
      console.log("Res ==> ",res)
      if (res.error) {
        throw new Error(res.error.errors.map((e) => e.message).join("\n"));
      }
    },
  });
  console.log("Result in route.ts without toTextStreamResponse ==> ", result);
  console.log("Result in route.ts ==> ", result);
  return result.toTextStreamResponse();
}
