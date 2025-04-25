import { commands, ExtensionContext } from "coc.nvim";
import { logger } from "./utils/logeer";

import {
  detailedAssist,
  quickAssist,
  selectClient,
  selectModel,
  selectSystemPrompt,
  showHistory,
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

  const client = commands.registerCommand("claude.selectClient", async () => {
    logger.info(`claude-code-selectClient`);
    selectClient();
  });

  const model = commands.registerCommand("claude.selectModel", async () => {
    logger.info(`claude-code-selectModel`);
    selectModel();
  });

  const systemPrompt = commands.registerCommand(
    "claude.selectSystemPrompt",
    async () => {
      logger.info(`claude-code-selectSystemPrompt`);
      selectSystemPrompt();
    },
  );

  const history = commands.registerCommand("claude.showHistory", async () => {
    logger.info(`claude-code-showHistory`);
    showHistory();
  });

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
    history,
    client,
    model,
    systemPrompt,
    showExample,
    writeExample,
    test,
  );
}
