import { apiRequestManager } from "./api";
import { historyManager } from "./history";
import { templateManager } from "./template";
import { showDetailedWindow, showInput, showResponse, toastInfo } from "./ui";

// インプットで質問する機能
export async function quickAssist() {
  showInput(async (question) => {
    if (question === "") return;

    const answer = await apiRequestManager.send(
      question,
      "You are a helpful assistant for developers. Provide clear, concise responses that can be directly used in code.",
    );
    historyManager.add(question, answer);
    toastInfo("AIから回答が届きました");
  });
}

// 詳細を質問する機能
export async function detailedAssist() {
  // プロンプトテンプレートを取得
  const items = templateManager.getItems();

  // 詳細質問用のウインドウを表示
  showDetailedWindow(items, async (question) => {
    if (question === "") return;

    const answer = await apiRequestManager.send(
      question,
      "You are a helpful assistant for developers. Provide clear, concise responses that can be directly used in code.",
    );
    historyManager.add(question, answer);
    toastInfo("AIから回答が届きました");
  });
}

export function showPromptTemplateExample() {
  const example = templateManager.example();
  showResponse({ title: "設定例", message: example });
}

export function writePromptTemplateExample() {
  templateManager.writeFile();
}
