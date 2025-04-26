import { generateText } from "ai";
import { perplexity } from "@ai-sdk/perplexity";
import { Item } from "../template";
import { AiClient } from "./common";
import { modelsToItem, perplexityModels } from "./models";

const isNumber = (value: any): value is number =>
  typeof value === "number" && !isNaN(value);

// API クライアントクラス
export class PerplexityClient implements AiClient {
  name = "Perplexity";
  description =
    "Perplexity：\nプログラミングは最新技術調査・出典付き情報検索に最適、コード生成は他AIに劣る。\n文章生成もリアルタイム検索・出典付きで調査や研究向き。";
  private apiKey: string;
  private model: string;
  private maxTokens: number = 1000;

  constructor() {
    this.apiKey = process.env.PERPLEXITY_API_KEY || "";
    this.model = process.env.PERPLEXITY_API_MODEL || "sonar-pro";

    const maxTokens = process.env.PERPLEXITY_API_MAX_TOKENS;
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
    // https://sdk.vercel.ai/providers/ai-sdk-providers/perplexity#perplexity-provider
    try {
      const { text } = await generateText({
        model: perplexity(this.model),
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
    const model = perplexityModels.find((item) => item.name === name);
    if (model) {
      this.model = model.name;
    }
  }

  getCurrentModel(): string {
    return this.model;
  }

  allModelItems(): Item[] {
    return modelsToItem(perplexityModels);
  }
}
