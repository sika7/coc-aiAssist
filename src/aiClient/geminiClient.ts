import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { Item } from "../template";
import { AiClient } from "./common";
import { geminiModels, modelsToItem } from "./models";

const isNumber = (value: any): value is number =>
  typeof value === "number" && !isNaN(value);

// API クライアントクラス
export class GeminiClient implements AiClient {
  name = "Gemini";
  description =
    "Gemini：\nプログラミングはGoogleサービス連携や大容量コンテキストで効率化。\n文章生成はGoogle連携、最新情報取得、大量データの要約や多言語対応が強み。";
  private apiKey: string;
  private model: string;
  private maxTokens: number = 1000;

  constructor() {
    this.apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    this.model =
      process.env.GOOGLE_GENERATIVE_AI_API_MODEL || "gemini-2.0-flash-001";

    const maxTokens = process.env.GOOGLE_GENERATIVE_AI_API_MAX_TOKENS;
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
      // https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic#anthropic-provider
      const { text } = await generateText({
        model: google(this.model),
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
    const model = geminiModels.find((item) => item.name === name);
    if (model) {
      this.model = model.name;
    }
  }

  getCurrentModel(): string {
    return this.model;
  }

  allModelItems(): Item[] {
    return modelsToItem(geminiModels);
  }
}
