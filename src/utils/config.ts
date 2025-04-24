import { parse } from "yaml";
import dotenv from "dotenv";
import { workspace } from "coc.nvim";
import { getNvimConfigFilePath, readFile } from "./utils";

export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export async function getConfig(): Promise<ClaudeConfig> {
  const envFilePath = await getNvimConfigFilePath(".env");
  dotenv.config({ path: envFilePath });

  // const apiKey = process.env.CLAUDE_API_KEY;
  const config = workspace.getConfiguration("claude");
  return {
    apiKey: config.get<string>("apiKey", ""),
    model: config.get<string>("module", "claude-3-7-sonnet-20250219"),
    maxTokens: config.get<number>("maxTokens", 1000),
  };
}

/**
 * YAML ファイルを読み込んでオブジェクトとして返す関数
 * @param filePath 読み込むYAMLファイルのパス
 */
export function readYamlFile<T = any>(filePath: string): T {
  const fileContents = readFile(filePath);
  const data = parse(fileContents);
  return data as T;
}
