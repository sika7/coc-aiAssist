import { commands, ExtensionContext } from "coc.nvim";
import { logger } from "./utils/logeer";

import {
  detailedAssist,
  historyClear,
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
  logger.info("aiAssist Command extension activated"); // 開発者ログ

  await apiRequestManager.init();

  if (!apiRequestManager.isHealthy()) {
    logger.error("aiAssist API keyが設定されていません");
    return;
  }

  const log = commands.registerCommand("aiAssist.log", async () => {
    logger.show();
  });

  const ask = commands.registerCommand("aiAssist.quickAssist", async () => {
    logger.info(`aiAssist-quickAssist`);
    quickAssist();
  });

  const detailedAsk = commands.registerCommand(
    "aiAssist.detailedAssist",
    async () => {
      logger.info(`aiAssist-detailedAssist`);
      detailedAssist();
    },
  );

  const client = commands.registerCommand("aiAssist.selectClient", async () => {
    logger.info(`aiAssist-selectClient`);
    selectClient();
  });

  const model = commands.registerCommand("aiAssist.selectModel", async () => {
    logger.info(`aiAssist-selectModel`);
    selectModel();
  });

  const systemPrompt = commands.registerCommand(
    "aiAssist.selectSystemPrompt",
    async () => {
      logger.info(`aiAssist-selectSystemPrompt`);
      selectSystemPrompt();
    },
  );

  const history = commands.registerCommand("aiAssist.showHistory", async () => {
    logger.info(`aiAssist-showHistory`);
    showHistory();
  });

  const historyClearCommand = commands.registerCommand(
    "aiAssist.historyClear",
    async () => {
      logger.info(`aiAssist-historyClear`);
      historyClear();
    },
  );

  const showExample = commands.registerCommand(
    "aiAssist.showExample",
    async () => {
      logger.info(`aiAssist-showExample`);
      showPromptTemplateExample();
    },
  );

  const writeExample = commands.registerCommand(
    "aiAssist.writeExample",
    async () => {
      logger.info(`aiAssist-showExample`);
      writePromptTemplateExample();
    },
  );

  const test = commands.registerCommand("aiAssist.test", async () => {
    logger.info(`aiAssist-test`);
    detailedAssist();
  });

  context.subscriptions.push(
    log,
    ask,
    detailedAsk,
    history,
    historyClearCommand,
    client,
    model,
    systemPrompt,
    showExample,
    writeExample,
    test,
  );
}
