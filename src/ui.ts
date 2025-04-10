import { window, workspace } from "coc.nvim";
import { logger } from "./logeer";

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
