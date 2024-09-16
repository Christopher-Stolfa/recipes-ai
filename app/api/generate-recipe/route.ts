import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import OpenAI from "openai";

export const runtime = "edge";

const TEMPLATE = `
You are a recipe generator that outputs only the best most accurate recipes possible, please generate a recipe relevant to the type of cuisine described in the Input: {input}.
The title of the recipe should be accurate and concise. If the recipe has an established name, please use that name and try not to invent new ones.
The recipe description should describe the dish and provide a historical fact about its origins, all within two sentences.
The recipe description should be interesting and not sound vague or AI generated.
Provide a time estimate of the step.
List the steps in an order that makes sense for the recipe.
When listing ingredients, provide the measurements and sort the ingredients ascending by importance.
The amount of ingredients should reflect the number of servings.
Each step should contain easy to read concise instructions that mentions time and measurements.
The id should be a UUID and the path should be a string for example: '/recipe/UUID'
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
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON schema if desired.
     */
    const schema = z
      .object({
        id: z.string().describe("A UUID"),
        path: z
          .string()
          .describe(
            "A path using the UUID id of this schema, example: `/recipe/UUID`"
          ),
        title: z.string().describe("The title of a recipe"),
        description: z.string().describe("A description of the recipe"),
        time: z.number().describe("The total recipe time in minutes"),
        servings: z.number().describe("The number of servings"),
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
        wordCount: z.number().describe("The number of words in the input"),
        chatResponse: z.string().describe("A response to the human's input"),
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
    // const image = await openai.images.generate({
    //   model: "dall-e-3",
    //   prompt: `A realistic image of: ${result?.description}`,
    //   n: 1,
    // });
    // const imageUrl = image?.data?.[0]?.url ?? "";
    // const recipeResult = { ...result, imageUrl };
    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
