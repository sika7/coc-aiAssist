import { apiRequestManager } from "./api";
import { historyManager } from "./history";
import { templateManager } from "./template";
import {
  showDetailedWindow,
  showHistoryWindow,
  showInput,
  showResponse,
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

export function showHistory() {
  const items = historyManager.getAllItems();
  showHistoryWindow("ヒストリー", "プロンプト", items);
}

export function showPromptTemplateExample() {
  const example = templateManager.example();
  showResponse({ title: "設定例", message: example });
}

export function writePromptTemplateExample() {
  templateManager.writeFile();
}
