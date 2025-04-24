import { historyManager } from "./history";
import { templateManager } from "./template";
import { showDetailedWindow, showInput, showResponse } from "./ui";

// インプットで質問する機能
export async function quickAssist() {
  showInput((question) => {
    if (question !== "") {
      historyManager.add(question, "");
    }
  });
}

// 詳細を質問する機能
export async function detailedAssist() {
  const items = templateManager.getItems();
  showDetailedWindow(items, (question) => {
    if (question !== "") {
      historyManager.add(question, "");
    }
  });
}

export function showPromptTemplateExample() {
  const example = templateManager.example();
  showResponse({ title: "設定例", message: example });
}

export function writePromptTemplateExample() {
  templateManager.writeFile();
}
