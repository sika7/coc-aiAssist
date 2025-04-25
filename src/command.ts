import { apiRequestManager } from "./api";
import { historyManager } from "./history";
import { templateManager } from "./template";
import {
  showDetailedWindow,
  showHistoryWindow,
  showInput,
  showResponse,
  showSelectWindow,
  toastInfo,
} from "./ui";

// インプットで質問する機能
export async function quickAssist() {
  showInput(async (question) => {
    if (question === "") return;

    const systemPrompt = templateManager.getCurrentSystemPrompt();
    const answer = await apiRequestManager.send(question, systemPrompt);
    historyManager.add(systemPrompt, question, answer);
    toastInfo("AIから回答が届きました");
  });
}

// 詳細を質問する機能
export async function detailedAssist() {
  // プロンプトテンプレートを取得
  const items = templateManager.getPromptTemplateItems();

  // 詳細質問用のウインドウを表示
  showDetailedWindow(
    "テンプレート選択",
    "テンプレ:",
    items,
    async (question) => {
      if (question === "") return;

      const systemPrompt = templateManager.getCurrentSystemPrompt();
      const answer = await apiRequestManager.send(question, systemPrompt);
      historyManager.add(systemPrompt, question, answer);
      toastInfo("AIから回答が届きました");
    },
  );
}

export async function selectClient() {
  const items = apiRequestManager.getClientItems();
  const client = apiRequestManager.getCurrentClientName();
  showSelectWindow(
    "AIを選択",
    `カレント:${client}`,
    "ivy",
    items,
    (selectClient) => {
      apiRequestManager.setCurrentClient(selectClient);
    },
  );
}

export async function selectModel() {
  const items = apiRequestManager.getModelItems();
  const model = apiRequestManager.getModel();
  showSelectWindow(
    "モデルを選択",
    `カレント:${model}`,
    "ivy",
    items,
    (selectModel) => {
      apiRequestManager.setModel(selectModel);
    },
  );
}

export async function selectSystemPrompt() {
  const items = templateManager.getSystemPromptTemplateItems();
  const role = templateManager.getCurrentSystemPromptName();
  showSelectWindow(
    "システムプロンプトを選択",
    `カレント:${role}`,
    "ivy",
    items,
    (selectRole) => {
      templateManager.setCurrentSystemPrompt(selectRole);
    },
  );
}

export function showHistory() {
  const items = historyManager.getAllItems();
  showHistoryWindow("ヒストリー", "プロンプト", items);
}

export function historyClear() {
  historyManager.clear();
  toastInfo("aiAssist 履歴をクリアしました。。");
}

export function showPromptTemplateExample() {
  const example = templateManager.example();
  showResponse({ title: "設定例", message: example });
}

export function writePromptTemplateExample() {
  templateManager.writeFile();
}
