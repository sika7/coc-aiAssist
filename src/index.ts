import { commands, ExtensionContext, window, workspace } from "coc.nvim";
import { focusWinId, showQuestionBox, showResponse } from "./ui";
import { createCodeOnlyPrompt } from "./prompt";
import { ClaudeClient } from "./aiClient/claudeClient";
import { logger } from "./utils/logeer";
import { getConfig } from "./utils/config";
import { makePrompt, selectedText, yankText } from "./utils/utils";

interface ClaudeCommandArgs {
  codeOnly?: boolean;
  yank?: boolean;
  requestPreview?: boolean;
  responsePreview?: boolean;
}

export async function activate(context: ExtensionContext): Promise<void> {
  // ロガーの初期化
  logger.info("Claude Command extension activated"); // 開発者ログ

  const { apiKey, model, maxTokens } = getConfig();
  const claudeClient = new ClaudeClient(apiKey, model, maxTokens);

  if (!apiKey) {
    logger.error(
      "Claude API key is not configured. Please set claude.apiKey in your settings.",
    );
    return;
  }

  const log = commands.registerCommand("claude.log", async () => {
    logger.show();
  });

  const cmd = async (
    args: ClaudeCommandArgs = {
      codeOnly: false,
      yank: false,
      requestPreview: false,
      responsePreview: true,
    },
  ) => {
    logger.info(`claude-code-run`);

    try {
      let placeholder = "Type your question here...";
      let codeOnlyMode = false;

      // コマンド引数からコードのみモードを設定
      if (args.codeOnly) {
        codeOnlyMode = true;
        placeholder = "[CODE ONLY MODE] Type your question here...";
      }

      // 質問を取得
      const question = await showQuestionBox(placeholder);
      if (!question) {
        logger.info("Empty question, not sending request to API");
        window.showInformationMessage(
          "Empty question, not sending request to API",
        );
        return;
      }

      // ビジュアルモードで選択中のテキストを取得
      const context = await selectedText();

      // 最終的なプロンプトを構築
      let prompt = makePrompt(question, context);

      if (codeOnlyMode) prompt = createCodeOnlyPrompt(prompt);
      logger.info(prompt);

      // リクエストをプレビューする(開発中)
      if (args.requestPreview) {
        const requestDialog = await showResponse({
          title: "Claude Request",
          message: prompt,
        });

        if (!requestDialog) return;
        requestDialog?.dispose();
      }

      // Claude API にリクエストを送信
      const response = await claudeClient.sendMessage(prompt);
      logger.info(response);

      // ヤンクにいれる
      if (args.yank) {
        await yankText(response);
      }

      // OKを選択した場合、テキストを挿入
      // await insertInformation(response);

      if (args.responsePreview) {
        // レスポンスを表示
        const dialog = await showResponse({
          title: "Claude Response",
          message: response,
        });
        const winId = await dialog?.winid;
        if (winId) {
          focusWinId(winId);
        }

        // ダイアログなどを削除
        if (dialog) {
          dialog.dispose();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message);
      }
    }
  };

  const ask = commands.registerCommand("claude.ask", async () => {
    logger.info(`claude-code-ask`);
    await cmd({
      codeOnly: false,
      responsePreview: true,
    });
  });

  const codeOnly = commands.registerCommand("claude.askCodeOnly", async () => {
    logger.info(`claude-code-askCodeOnly`);

    await cmd({
      codeOnly: true,
      responsePreview: true,
    });
  });

  const closeDialogCommandDisposable = commands.registerCommand(
    "claude.closeDialog",
    async () => {},
  );

  const focusDialogCommandDisposable = commands.registerCommand(
    "claude.focusDialog",
    async () => {},
  );

  const visualAsk = workspace.registerKeymap(
    ["v"],
    "claude-ask",
    async () => {
      await cmd({
        codeOnly: false,
        responsePreview: true,
      });
    },
    { silent: true },
  );
  const visualCodeOnly = workspace.registerKeymap(
    ["v"],
    "claude-ask-code-only",
    async () => {
      await cmd({
        codeOnly: true,
        responsePreview: true,
      });
    },
    { silent: true },
  );

  context.subscriptions.push(
    log,
    ask,
    codeOnly,
    visualAsk,
    visualCodeOnly,
    closeDialogCommandDisposable,
    focusDialogCommandDisposable,
  );
}
