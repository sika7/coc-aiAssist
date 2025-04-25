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

export async function showTestWindow() {}

export async function showInput(callback: (text: string) => void) {
  const eventName = `aiAssist.input.${generateShortUuid(8)}`;
  eventManager.registerCallback(eventName, callback);
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").show_input("${eventName}", "質問", "")`,
  ]);
}

export async function showDetailedWindow(
  title = "",
  prompt = "",
  items: Item[],
  callback: (text: string) => void,
) {
  const eventName = `aiAssist.window.${generateShortUuid(8)}`;
  const itemsText = JSON.stringify(items).replace(/'/g, "\\'");
  eventManager.registerCallback(eventName, callback);
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").showDetailedWindow("${eventName}", "${title}", "${prompt}", '${itemsText}')`,
  ]);
}

export async function toastInfo(message: string) {
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").toastInfo("${message}")`,
  ]);
}

export async function showSelectWindow(
  title = "",
  prompt = "",
  layoutType: "select" | "ivy" | "default" | "vertical" | "vscode" = "default",
  items: Item[] = [],
  callback: (selectValue: string) => void,
) {
  const eventName = `aiAssist.selectWin.${generateShortUuid(8)}`;
  const itemsText = JSON.stringify(items).replace(/'/g, "\\'");
  eventManager.registerCallback(eventName, (value) => {
    callback(value);
  });
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").selectWindow("${eventName}", "${title}", "${prompt}", "${layoutType}", '${itemsText}')`,
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

export async function showHistoryWindow(
  title = "",
  prompt = "",
  items: Item[] = [],
) {
  const itemsText = JSON.stringify(items).replace(/'/g, "\\'");
  workspace.nvim.call("luaeval", [
    `require("coc-aiAssist").historyWindow("${title}", "${prompt}", '${itemsText}')`,
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
