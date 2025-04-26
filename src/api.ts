import dotenv from "dotenv";
import { ClaudeClient } from "./aiClient/claudeClient";
import { AiClient } from "./aiClient/common";
import { getNvimConfigFilePath } from "./utils/utils";
import { GeminiClient } from "./aiClient/geminiClient";

export interface Item {
  text: string;
  value: string; // 選択時に返却されるデータ
}

class ApiRequestManager {
  currentClient: AiClient | undefined;
  clients: AiClient[] = [];

  constructor() {}

  async init() {
    // ~/.config/nvim/.envから環境変数を取得
    const envFilePath = await getNvimConfigFilePath(".env");
    dotenv.config({ path: envFilePath });

    // クライアントで環境変数を使用
    const AiClients: AiClient[] = [new ClaudeClient(), new GeminiClient()];

    this.clients = this.healthyClients(AiClients);
    this.currentClient = this.clients[0];
  }

  isHealthy() {
    return this.clients.length > 0;
  }

  private healthyClients(clients: AiClient[]) {
    // 実行可能なクライアントを取得
    return clients.filter((client) => {
      return client.isHealthy();
    });
  }

  getClientItems(): Item[] {
    return this.clients.map((item) => {
      return {
        text: item.name,
        value: item.name,
        preview: {
          text: item.description,
          ft: "markdown",
        },
      };
    });
  }

  getCurrentClientName() {
    if (this.currentClient) return this.currentClient.name;
    return "";
  }

  setCurrentClient(name: string) {
    const client = this.clients.find((c) => c.name === name);
    if (client) {
      this.currentClient = client;
    }
  }

  getModelItems() {
    // モデルの選択肢を返す
    const client = this.currentClient;
    if (client) {
      return client.allModelItems();
    }
    return [];
  }

  setModel(name: string) {
    // モデルの選択肢を返す
    const client = this.currentClient;
    if (client) {
      client.setModel(name);
    }
  }

  getModel() {
    const client = this.currentClient;
    if (client) {
      return client.getCurrentModel();
    }
    return "";
  }

  async send(message: string, system: string) {
    if (!this.currentClient) {
      throw new Error("クライアントがありません");
    }
    return await this.currentClient.sendMessage(message, system);
  }
}

export const apiRequestManager = new ApiRequestManager();
