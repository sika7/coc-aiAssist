import { Item } from "../template";

export interface AiClient {
  name: string;
  description: string;
  isHealthy(): boolean;
  sendMessage(message: string, system: string): Promise<string>;

  setModel(name: string): void;
  getCurrentModel(): string;
  allModelItems(): Item[];
}
