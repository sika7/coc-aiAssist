import axios from "axios";
import { logger } from "./logeer";
import { jsonToText } from "./utils";

export async function postRequest(url: string, data?: any, headers?: any) {
  try {
    const response = await axios.post(url, data, {
      headers,
    });

    // レスポンス構造のログ
    logger.info(`Content structure: ${jsonToText(response.data)}`);

    if (response.data && response.data.content) {
      return response;
    }
    throw new Error("Invalid response from API");
  } catch (error) {
    // instanceof を使用して型安全にエラーをチェック
    if (error instanceof Error) {
      logger.error(`Error calling API: ${error.message}`);
    } else {
      // 未知のエラーオブジェクト
      logger.error("Unknown error occurred", error);
    }

    logger.show(); // エラー時にログを表示
    throw error;
  }
}
