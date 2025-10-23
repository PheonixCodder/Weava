import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"

const google = createGoogleGenerativeAI()
const openai = createOpenAI()
const anthropic = createAnthropic()

export const execute = inngest.createFunction({id: "execute-ai"}, { event : "execute/ai" }, async ({event, step}) => {
    const { steps : geminiSteps} = await step.ai.wrap("generate-text", generateText,
    {
        model: google("gemini-2.5-flash"),
        system: "You are a helpful assistant.",
        prompt:"What is the capital of France?"
    }
    );

    const { steps : openaiSteps} = await step.ai.wrap("generate-text", generateText,
    {
        model: openai("gpt-4o-mini"),
        system: "You are a helpful assistant.",
        prompt:"What is the capital of France?"
    }
    );
    const { steps : anthropicSteps} = await step.ai.wrap("generate-text", generateText,
    {
        model: anthropic("claude-3-5-haiku-20241022"),
        system: " are a helpful assistant.",
        prompt:"What is the capital of France?"
    }
    );


    return steps
})