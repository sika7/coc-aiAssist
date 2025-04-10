import { postRequest } from "./apiRequest";
import { removeMarkdownFormat } from "./utils";

// APIレスポンスの型 実際には配列で変える
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

// Claude API クライアントクラス
export class ClaudeClient {
  private apiKey: string;
  private model: string;
  private maxTokens: number;

  constructor(apiKey: string, model: string, maxTokens: number) {
    this.apiKey = apiKey;
    this.model = model;
    this.maxTokens = maxTokens;
  }

  async sendMessage(message: string): Promise<string> {
    try {
      // コードオンリーモードを検出
      const isCodeOnlyRequest = message.includes(
        "I need only executable code with no explanations",
      );

      const system = isCodeOnlyRequest
        ? "You are a code generator. You always respond with only functioning code, no explanations outside of code comments."
        : "You are a helpful assistant for developers. Provide clear, concise responses that can be directly used in code.";

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
        // コードオンリーリクエストの場合、マークダウンフォーマットを取り除く

        if (isCodeOnlyRequest) {
          result = removeMarkdownFormat(result);
        }

        return result;
      }

      throw new Error("Invalid response format from Claude API");
    } catch (error) {
      throw error;
    }
  }
}
