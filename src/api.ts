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

  getSelectItems(): Item[] {
    return this.clients.map((item) => {
      return {
        text: item.name,
        value: item.key,
      };
    });
  }

  getCurrentModelName() {
    if (this.currentClient) return this.currentClient.name;
    return "";
  }

  setCurrentModel(key: string) {
    const client = this.clients.find((c) => c.key === key);
    if (!client) {
      throw new Error("指定されたクライアントはありません");
    }
    this.currentClient = client;
  }

  async send(message: string, system: string) {
    if (!this.currentClient) {
      throw new Error("クライアントがありません");
    }
    return await this.currentClient.aiClient.sendMessage(message, system);
  }
}

export const apiRequestManager = new ApiRequestManager();
