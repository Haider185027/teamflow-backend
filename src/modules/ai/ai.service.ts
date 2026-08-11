import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"];
const DEFAULT_PRIORITY = "MEDIUM";

export async function suggestTaskPriority(title: string, description?: string): Promise<string> {
  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 10,
      system:
        'You are a task urgency classifier. Respond with ONLY one word, no punctuation: "LOW", "MEDIUM", or "HIGH".',
      messages: [
        {
          role: "user",
          content: `Title: ${title}\nDescription: ${description || "(no description)"}`,
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    const suggestion = textBlock && "text" in textBlock ? textBlock.text.trim().toUpperCase() : "";

    return VALID_PRIORITIES.includes(suggestion) ? suggestion : DEFAULT_PRIORITY;
  } catch (err) {
    console.error("AI priority suggestion failed:", err);
    return DEFAULT_PRIORITY;
  }
}
