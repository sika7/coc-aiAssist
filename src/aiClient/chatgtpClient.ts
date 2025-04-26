import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { Item } from "../template";
import { AiClient } from "./common";
import { chatGtpModels, modelsToItem } from "./models";

const isNumber = (value: any): value is number =>
  typeof value === "number" && !isNaN(value);

// API クライアントクラス
export class ChatGtpClient implements AiClient {
  name = "ChatGtp";
  description =
    "ChatGPT：\nプログラミングでは幅広い言語・用途に対応し、自然な対話でコーディング支援。\n文章生成も自然で多用途、要約・翻訳・ビジネス文書作成に強い。";
  private apiKey: string;
  private model: string;
  private maxTokens: number = 1000;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    this.model = process.env.OPENAI_API_MODEL || "gpt-4.1-mini";

    const maxTokens = process.env.OPENAI_API_MAX_TOKENS;
    if (isNumber(maxTokens)) {
      this.maxTokens = maxTokens;
    }
  }

  isHealthy() {
    if (this.apiKey === "") return false;
    if (this.model === "") return false;
    return true;
  }

  async sendMessage(message: string, system: string): Promise<string> {
    try {
      // https://sdk.vercel.ai/providers/ai-sdk-providers/openai#openai-provider
      const { text } = await generateText({
        model: openai(this.model),
        maxTokens: this.maxTokens,
        system: system,
        prompt: message,
      });

      if (text) {
        return text;
      }

      throw new Error("Invalid response format from Claude API");
    } catch (error) {
      throw error;
    }
  }

  setModel(name: string): void {
    const model = chatGtpModels.find((item) => item.name === name);
    if (model) {
      this.model = model.name;
    }
  }

  getCurrentModel(): string {
    return this.model;
  }

  allModelItems(): Item[] {
    return modelsToItem(chatGtpModels);
  }
}
