import dotenv from "dotenv";
import { ClaudeClient } from "./aiClient/claudeClient";
import { AiClient } from "./aiClient/common";
import { getNvimConfigFilePath } from "./utils/utils";

export interface Item {
  text: string;
  value: string; // 選択時に返却されるデータ
}

interface Client {
  name: string; // 表示名
  key: string; // 小文字
  aiClient: AiClient;
}

class ApiRequestManager {
  currentClient: Client | undefined;
  clients: Client[] = [];

  constructor() {}

  async init() {
    // ~/.config/nvim/.envから環境変数を取得
    const envFilePath = await getNvimConfigFilePath(".env");
    dotenv.config({ path: envFilePath });

    // クライアントで環境変数を使用
    const AiClients: Client[] = [
      {
        name: "Claude",
        key: "claude",
        aiClient: new ClaudeClient(),
      },
    ];

    this.clients = this.healthyClients(AiClients);
    this.currentClient = this.clients[0];
  }

  isHealthy() {
    return this.clients.length > 0;
  }

  private healthyClients(clients: Client[]) {
    // 実行可能なクライアントを取得
    return clients.filter((client) => {
      return client.aiClient.isHealthy();
    });
  }

  getClientItems(): Item[] {
    return this.clients.map((item) => {
      return {
        text: item.name,
        value: item.key,
      };
    });
  }

  getCurrentClientName() {
    if (this.currentClient) return this.currentClient.name;
    return "";
  }

  setCurrentClient(key: string) {
    const client = this.clients.find((c) => c.key === key);
    if (client) {
      this.currentClient = client;
    }
  }

  getModelItems() {
    // モデルの選択肢を返す
    const client = this.currentClient;
    if (client) {
      return client.aiClient.allModelItems();
    }
    return [];
  }

  setModel(name: string) {
    // モデルの選択肢を返す
    const client = this.currentClient;
    if (client) {
      client.aiClient.setModel(name);
    }
  }

  getModel() {
    const client = this.currentClient;
    if (client) {
      return client.aiClient.getCurrentModel();
    }
    return ""
  }

  async send(message: string, system: string) {
    if (!this.currentClient) {
      throw new Error("クライアントがありません");
    }
    return await this.currentClient.aiClient.sendMessage(message, system);
  }
}

export const apiRequestManager = new ApiRequestManager();
