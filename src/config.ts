import { workspace } from "coc.nvim";

export interface ClaudeConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

export function getConfig(): ClaudeConfig {
  const config = workspace.getConfiguration("claude");
  return {
    apiKey: config.get<string>("apiKey", ""),
    model: config.get<string>("module", "claude-3-7-sonnet-20250219"),
    maxTokens: config.get<number>("maxTokens", 1000),
  };
}

