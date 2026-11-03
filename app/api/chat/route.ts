import {
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";

import { model, systemPrompt } from "@/lib/ai/config";

// Handle incoming chat messages and stream Gemini's response.
export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model,
      system: systemPrompt,
      messages: await convertToModelMessages(messages),

      providerOptions: {
        google: {
          store: false,
        },
      },

      onError({ error }) {
        console.error("TripTale Gemini Error:", error);

        if (error instanceof Error) {
          console.error("Error message:", error.message);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("TripTale API Route Error:", error);

    return Response.json(
      { error: "Failed to process chat request." },
      { status: 500 },
    );
  }
}