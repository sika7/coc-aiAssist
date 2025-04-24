import { templateManager } from "./template";
import { showDetailedWindow, showResponse } from "./ui";

// インプットで質問する機能
export async function quickAssist() {}

// 詳細を質問する機能
export async function detailedAssist() {
  const items = templateManager.getItems();
  showDetailedWindow(items);
}

export function showExample() {
  const example = templateManager.example();
  showResponse({ title: "設定例", message: example });
}

export function writeExample() {
  templateManager.writeFile();
}
