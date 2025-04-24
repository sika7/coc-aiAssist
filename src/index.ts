import { commands, ExtensionContext } from "coc.nvim";
import { logger } from "./utils/logeer";

import {
  detailedAssist,
  quickAssist,
  showPromptTemplateExample,
  writePromptTemplateExample,
} from "./command";
import { apiRequestManager } from "./api";

export async function activate(context: ExtensionContext): Promise<void> {
  // ロガーの初期化
  logger.info("Claude Command extension activated"); // 開発者ログ

  await apiRequestManager.init();

  if (!apiRequestManager.isHealthy()) {
    logger.error("API key is not configured.");
    return;
  }

  const log = commands.registerCommand("claude.log", async () => {
    logger.show();
  });

  // const cmd = async (
  //   args: ClaudeCommandArgs = {
  //     codeOnly: false,
  //     yank: false,
  //     requestPreview: false,
  //     responsePreview: true,
  //   },
  // ) => {
  //   logger.info(`claude-code-run`);
  //
  //   try {
  //     let placeholder = "Type your question here...";
  //     let codeOnlyMode = false;
  //
  //     // コマンド引数からコードのみモードを設定
  //     if (args.codeOnly) {
  //       codeOnlyMode = true;
  //       placeholder = "[CODE ONLY MODE] Type your question here...";
  //     }
  //
  //     // 質問を取得
  //     const question = await showQuestionBox(placeholder);
  //     if (!question) {
  //       logger.info("Empty question, not sending request to API");
  //       window.showInformationMessage(
  //         "Empty question, not sending request to API",
  //       );
  //       return;
  //     }
  //
  //     // ビジュアルモードで選択中のテキストを取得
  //     const context = await selectedText();
  //
  //     // 最終的なプロンプトを構築
  //     let prompt = makePrompt(question, context);
  //
  //     if (codeOnlyMode) prompt = createCodeOnlyPrompt(prompt);
  //     logger.info(prompt);
  //
  //     // リクエストをプレビューする(開発中)
  //     if (args.requestPreview) {
  //       const requestDialog = await showResponse({
  //         title: "Claude Request",
  //         message: prompt,
  //       });
  //
  //       if (!requestDialog) return;
  //       requestDialog?.dispose();
  //     }
  //
  //     // Claude API にリクエストを送信
  //     const system = codeOnlyMode
  //       ? "You are a code generator. You always respond with only functioning code, no explanations outside of code comments."
  //       : "You are a helpful assistant for developers. Provide clear, concise responses that can be directly used in code.";
  //
  //     let response = await apiRequestManager.send(prompt, system);
  //
  //     // コードオンリーリクエストの場合、マークダウンフォーマットを取り除く
  //     if (codeOnlyMode) {
  //       response = removeMarkdownFormat(response);
  //     }
  //     logger.info(response);
  //
  //     // ヤンクにいれる
  //     if (args.yank) {
  //       await yankText(response);
  //     }
  //
  //     // OKを選択した場合、テキストを挿入
  //     // await insertInformation(response);
  //
  //     if (args.responsePreview) {
  //       // レスポンスを表示
  //       const dialog = await showResponse({
  //         title: "Claude Response",
  //         message: response,
  //       });
  //       const winId = await dialog?.winid;
  //       if (winId) {
  //         focusWinId(winId);
  //       }
  //
  //       // ダイアログなどを削除
  //       if (dialog) {
  //         dialog.dispose();
  //       }
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       logger.error(error.message);
  //     }
  //   }
  // };

  const ask = commands.registerCommand("claude.quickAssist", async () => {
    logger.info(`claude-code-quickAssist`);
    quickAssist();
  });

  const detailedAsk = commands.registerCommand(
    "claude.detailedAssist",
    async () => {
      logger.info(`claude-code-detailedAssist`);
      detailedAssist();
    },
  );

  const showExample = commands.registerCommand(
    "claude.showExample",
    async () => {
      logger.info(`claude-code-showExample`);
      showPromptTemplateExample();
    },
  );

  const writeExample = commands.registerCommand(
    "claude.writeExample",
    async () => {
      logger.info(`claude-code-showExample`);
      writePromptTemplateExample();
    },
  );

  const test = commands.registerCommand("claude.test", async () => {
    logger.info(`claude-code-test`);
    detailedAssist();
  });

  context.subscriptions.push(
    log,
    ask,
    detailedAsk,
    showExample,
    writeExample,
    test,
  );
}
