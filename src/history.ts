import { homeDirPath, readFile, saveFile } from "./utils/utils";
import { logger } from "./utils/logeer";
import { Item } from "./template";

interface HistoryEntry {
  system: string;
  question: string;
  answer: string;
  timestamp: number;
}

const MAX_HISTORY = 200;
const HISTORY_PATH = homeDirPath(".local/share/nvim/ai-assist/history.json");

class HistoryManager {
  private entries: HistoryEntry[] = [];

  constructor() {
    this.load();
  }

  public add(system: string, question: string, answer: string): void {
    this.entries.unshift({ system, question, answer, timestamp: Date.now() });

    if (this.entries.length > MAX_HISTORY) {
      this.entries = this.entries.slice(0, MAX_HISTORY);
    }

    this.save();
  }

  public getAllItems(): Item[] {
    return this.entries.map((item) => {
      return {
        text: `${item.question} ${item.system} ${item.answer}`,
        value: item.answer,
        preview: {
          text: item.answer,
          ft: "markdown",
        },
      };
    });
  }

  clear() {
    this.entries = []
    this.save()
  }

  private save(): void {
    try {
      saveFile(HISTORY_PATH, this.entries);
    } catch (err) {
      logger.error("回答の保存に失敗しました");
    }
  }

  private load(): void {
    try {
      const data = readFile(HISTORY_PATH);
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        this.entries = parsed.slice(0, MAX_HISTORY);
      }
    } catch (err) {
      logger.info("ヒストリーファイルがありません");
    }
  }
}

export const historyManager = new HistoryManager();
