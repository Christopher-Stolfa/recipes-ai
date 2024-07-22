import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

// const TEMPLATE = `Extract the requested fields from the input.

// The field "entity" refers to the first mentioned entity in the input.

// Input:

// {input}`;

const TEMPLATE = `
You are a recipe generator that only comes up with the best most accurate recipes possible, please generate a recipe relevant to the type of cuisine described in the Input: {input}.
The title of the recipe should be concise.
Provide a time estimate of the step.
List the steps in an order that makes sense for the recipe.
When listing ingredients, please provide the the measurements.
Each step should should contain easy to read concise instructions that mentions time and measurements.
, 
`;

/**
 * This handler initializes and calls an OpenAI Functions powered
 * structured output chain. See the docs for more information:
 *
 * https://js.langchain.com/v0.2/docs/how_to/structured_output
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages ?? [];
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * Function calling is currently only supported with ChatOpenAI models
     */
    const model = new ChatOpenAI({
      temperature: 0.8,
      model: "gpt-3.5-turbo-0125",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON schema if desired.
     */
    const schema = z
      .object({
        title: z.string().describe("The title of a recipe"),
        ingredients: z
          .array(z.string().describe("An ingredient"))
          .describe("The list of the ingredients used in all the steps"),
        steps: z
          .array(
            z.object({
              step: z.number().describe("The step number"),
              title: z.string().describe("The title of the step"),
              time: z
                .string()
                .describe("The amount of time the step requires."),
              instructions: z
                .array(z.string().describe("An instruction for the step"))
                .describe("A list of instructions for the step"),
            })
          )
          .describe("A list of steps of the recipe"),
        word_count: z.number().describe("The number of words in the input"),
        chat_response: z.string().describe("A response to the human's input"),
      })
      .describe("Should always be used to properly format output");

    /**
     * Bind schema to the OpenAI model.
     * Future invocations of the returned model will always match the schema.
     *
     * Under the hood, uses tool calling by default.
     */
    const functionCallingModel = model.withStructuredOutput(schema, {
      name: "output_formatter",
    });

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt.pipe(functionCallingModel);

    const result = await chain.invoke({
      input: currentMessageContent,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
