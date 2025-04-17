import { Range, TextEdit, window, workspace } from "coc.nvim";
import { logger } from "./logeer";

export function jsonToText(obj: any): string {
  return JSON.stringify(obj, null, 2);
}

// マークダウンフォーマットを取り除く
export function removeMarkdownFormat(text: string) {
  // コードブロックからコードを抽出
  const codeBlockRegex = /```(?:\w*\n)?([\s\S]*?)```/g;
  const matches = [...text.matchAll(codeBlockRegex)];

  if (matches.length > 0) {
    // 最初に見つかったコードブロックのコンテンツを使用
    return matches[0][1].trim();
  }
  // マークダウンコードブロックが見つからない場合、
  // テキスト全体がコードと見なして、先頭と末尾の```を取り除く
  return text.replace(/^```\w*\n|```$/g, "").trim();
}

export async function yankText(text: string) {
  // レスポンスをyankレジスタに入れる
  await workspace.nvim.call("setreg", ["*", text]);
  logger.info("Response copied to clipboard (yank register)");
}

export async function writeText(text: string) {
  if (text == "") return;

  const doc = await workspace.document;
  const position = await window.getCursorPosition();
  const range = Range.create(position, position);
  const edit: TextEdit = { range, newText: text };
  await doc.applyEdits([edit]);
}

export async function insertInformation(text: string) {
  // OKを選択した場合、テキストを挿入
  const result = await window.showInformationMessage("Insert?", "yes", "no");
  if (result === "yes") {
    writeText(text);
  }
}

// ビジュアルモードで選択中のテキストを取得
export async function selectedText() {
  const doc = await workspace.document;
  const range = await window.getSelectedRange("");
  let context = "";

  logger.info(jsonToText(range));

  // レンジがあるとき（選択されたとき）
  if (range) {
    context = doc.textDocument.getText(range);
    // window.selectRange(Range.create(0, 0, 0, 0));
    // workspace.nvim.command('normal! <Esc>');
  }

  return context;
}

export function makePrompt(question: string, code: string | null) {
  // 最終的なプロンプトを構築
  let prompt = question;
  if (code && code.trim() !== "") {
    prompt = `${question}\n\nSelected code:\n\`\`\`\n${code}\n\`\`\``;
  }
  return prompt;
}

export async function getBufferIdFromWindowId(
  windowId: number,
): Promise<number> {
  const nvim = workspace.nvim;
  try {
    const bufferId = await nvim.call("winbufnr", [windowId]);
    return bufferId as number;
  } catch (error) {
    logger.error(
      `ウィンドウID ${windowId} からバッファーIDの取得に失敗しました:`,
      error,
    );
    return -1;
  }
}
