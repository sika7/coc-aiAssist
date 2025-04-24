import { window, workspace } from "coc.nvim";
import { eventManager } from "./eventManager";
import { logger } from "./utils/logeer";

export interface Item {
  text: string;
  value: string;
  preview?: {
    text: string;
    ft: string;
  };
}

function generateShortUuid(length: number = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

export async function showTestWindow() {
}

export async function showInput(callback: (text: string) => void) {
  const eventName = `aiAssist.input.${generateShortUuid(8)}`;
  eventManager.registerCallback(eventName, callback);
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").show_input("${eventName}", "質問", "")`,
  ]);
}

export async function showDetailedWindow(items: Item[], callback: (text: string) => void) {
  const eventName = `aiAssist.window.${generateShortUuid(8)}`;
  const itemsText = JSON.stringify(items).replace(/'/g, "\\'");
  eventManager.registerCallback(eventName, callback);
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").showDetailedWindow("${eventName}", '${itemsText}')`,
  ]);
}

export async function showSelectWindow(
  title = "",
  prompt = "",
  items: Item[] = [],
  callback: (selectValue: string) => void,
) {
  const eventName = `aiAssist.selectWin.${generateShortUuid(8)}`;
  const itemsText = JSON.stringify(items).replace(/'/g, "\\'");
  eventManager.registerCallback(eventName, (value) => {
    callback(value);
  });
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").selectWindow("${eventName}", "${title}", "${prompt}", '${itemsText}')`,
  ]);
}

export async function showSelectAndPreviewWindow(
  title = "",
  prompt = "",
  items: Item[] = [],
  callback: (selectValue: string) => void,
) {
  const eventName = `aiAssist.selectAndPreviewWin.${generateShortUuid(8)}`;
  const itemsText = JSON.stringify(items).replace(/'/g, "\\'");
  eventManager.registerCallback(eventName, (value) => {
    callback(value);
    // items
    //   .filter((item) => item.value == value)
    //   .map((item) => item.preview.text)
    //   .forEach((text) => {
    //     logger.info(text);
    //   });
  });
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").selectAndPreviewWindow("${eventName}", "${title}", "${prompt}", '${itemsText}')`,
  ]);
}

/**
 * フローティングウィンドウ
 */
export async function showFloatingWindow(message: string): Promise<void> {
  const floatingWindow = window.createFloatFactory({
    border: true,
    title: "Claude Response",
    position: "auto",
  });
  return await floatingWindow.show([
    // { filetype: "markdown", content: message },
    { filetype: "highlight", content: message },
  ]);
}

// レスポンスを表示
export async function showResponse({
  title = "",
  message = "",
}: {
  title: string;
  message: string;
}) {
  return await window.showDialog({
    close: false,
    title: title,
    content: message,
  });
}

export async function focusWinId(winId: number) {
  await workspace.nvim.call("win_gotoid", [winId]);
}

export async function showQuestionBox(placeholder: string = "") {
  const input = await window.createInputBox("質問", "", {
    minWidth: 80,
    position: "center",
    placeholder,
  });

  return await new Promise<string | null>((resolve) => {
    input.onDidChange(() => {
      input.loading = true;
    });
    input.onDidFinish((text) => {
      setTimeout(() => {
        resolve(text);
      }, 50);
    });
  });
}
