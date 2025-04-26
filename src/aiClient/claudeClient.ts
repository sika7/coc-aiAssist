import { generateText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { Item } from "../template";
import { AiClient } from "./common";
import { claudeModels, modelsToItem } from "./models";

const isNumber = (value: any): value is number =>
  typeof value === "number" && !isNaN(value);

// Claude API クライアントクラス
export class ClaudeClient implements AiClient {
  name = "claude";
  description =
    "提供: Anthropic\n・特徴: 安全性・丁寧さ・構造理解が高い。長文処理・仕様理解・コード生成に強い\n・用途: コーディング、技術文書の理解、長文要約、対話支援";
  private apiKey: string;
  private model: string;
  private maxTokens: number = 1000;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";
    this.model =
      process.env.ANTHROPIC_API_MODEL || "claude-3-7-sonnet-20250219";

    const maxTokens = process.env.ANTHROPIC_API_MAX_TOKENS;
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
        model: anthropic(this.model),
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
    const model = claudeModels.find((item) => item.name === name);
    if (model) {
      this.model = model.name;
    }
  }

  getCurrentModel(): string {
    return this.model;
  }

  allModelItems(): Item[] {
    return modelsToItem(claudeModels);
  }
}
