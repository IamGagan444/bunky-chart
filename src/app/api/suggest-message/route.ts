import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const prompt =
      "Create a list of three open-ended engngin questions formatted as a single string. Each question should be separated by '||' this questions are for an annonumos social messaging platform, like Quooh.me and should be suitable for diaverse audience. avoid personal and sensetive topics, focusing instead universal theme that encourage friendly interaction . for example, your output should be strucured like this : 'whats a hobby you recently started?||if you could have any dinner with historical figure, who whould it be?||whats a simple thing that make you happy?. ensure the questions are enterguing, foaster curosity and contibute to a posetive and welcoming conservetional  enviroment. ";

    const result = await streamText({
      model: openai("gpt-4-turbo"),
      messages: convertToCoreMessages(messages),
      maxTokens: 400,
      prompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return Response.json({ error: error, success: false }, { status: 500 });
  }
}
