import { Item } from "../template";
import { postRequest } from "../utils/request";
import { AiClient } from "./common";
import { claudeModels, modelsToItem } from "./models";

// APIレスポンスの型 実際には配列で帰る
export interface ClaudeTextContent {
  type: string;
  text: string;
}

// レスポンス構造の処理
function responseToText(content: ClaudeTextContent[]): string {
  // content は配列で、各要素に type が含まれる
  return content
    .filter((item: any) => item.type === "text")
    .map((item: any) => item.text)
    .join("\n");
}

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
    this.apiKey = process.env.CLAUDE_API_KEY || "";
    this.model = process.env.CLAUDE_API_MODEL || "claude-3-7-sonnet-20250219";

    const maxTokens = process.env.CLAUDE_API_MAX_TOKENS;
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
      const requestData = {
        model: this.model,
        max_tokens: this.maxTokens,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        system,
      };

      const headers = {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      };

      const response = await postRequest(
        "https://api.anthropic.com/v1/messages",
        requestData,
        headers,
      );

      let result = "";
      // レスポンス構造の処理
      if (response.data && response.data.content) {
        // content は配列で、各要素に type が含まれる
        result = responseToText(response.data.content);
        return result;
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
