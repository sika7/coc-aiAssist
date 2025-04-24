import { parse } from "yaml";
import dotenv from "dotenv";
import { getNvimConfigFilePath, readFile } from "./utils";

export async function getConfig(): Promise<void> {
  const envFilePath = await getNvimConfigFilePath(".env");
  dotenv.config({ path: envFilePath });
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
