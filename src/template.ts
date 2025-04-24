import { readYamlFile } from "./utils/config";
import {
  getPluginFilePath,
  getStdPath,
  notis,
  readFile,
  writeFileIfNotExistsAsync,
} from "./utils/utils";
import { logger } from "./utils/logeer";

type SystemTemplate = {
  lavel: string;
  value: string;
  preview: string;
};

type PromptTemplate = {
  template_type: string;
  template: string;
};

interface PromptTemplateData {
  version: string;
  system: SystemTemplate[];
  templates: PromptTemplate[];
}

export interface Item {
  text: string;
  value: string; // 選択時に返却されるデータ
  preview?: {
    text: string;
    ft: string;
  };
}

function fileDataToTemplate(data: PromptTemplateData): Item[] {
  return data.templates.map((item) => {
    return {
      text: `${item.template_type}                                                                                                                                      ${item.template}`,
      value: item.template_type,
      preview: {
        text: item.template,
        ft: "markdown",
      },
    };
  });
}

function systemDataToItem(data: SystemTemplate[]): Item[] {
  return data.map((item) => {
    return {
      text: `${item.lavel}                                                                                                                                      ${item.preview}`,
      value: item.lavel,
      preview: {
        text: item.preview,
        ft: "markdown",
      },
    };
  });
}

class TemplateManager {
  private promptTemplates: Item[] = [];
  private systemPrompts: SystemTemplate[] = [];
  private currentSystemPrompt: SystemTemplate | undefined;

  constructor() {
    this.readFile();
  }

  example() {
    // 例を見せる
    const filePath = getPluginFilePath("./prompt-template.yaml.example");
    return readFile(filePath);
  }

  async writeFile() {
    // 設定フアイルがなければ書き込む
    const configPath = await getStdPath();
    const yamlPath = `${configPath}/prompt-template.yaml`;
    const file = this.example();
    try {
      writeFileIfNotExistsAsync(yamlPath, file);
      notis("書き込みが完了しました");
    } catch (error) {
      logger.error("ファイルが存在します", error);
    }
  }

  async readFile() {
    try {
      const configPath = await getStdPath();
      const yamlPath = `${configPath}/prompt-template.yaml`;
      const promptTemplate = readYamlFile<PromptTemplateData>(yamlPath);

      this.promptTemplates = fileDataToTemplate(promptTemplate);
      this.systemPrompts = promptTemplate.system;
      this.currentSystemPrompt = this.systemPrompts[0];
    } catch (error) {
      logger.error("プロンプトテンプレートの読み込みに失敗しました", error);
    }
  }

  getPromptTemplateItems() {
    return this.promptTemplates;
  }

  setCurrentSystemPrompt(name: string) {
    const prompt = this.systemPrompts.find((item) => item.lavel === name);
    if (prompt) {
      this.currentSystemPrompt = prompt;
    }
  }

  getCurrentSystemPromptName() {
    const pronpt = this.currentSystemPrompt;
    if (pronpt) return pronpt.lavel;
    return "未設定";
  }

  getCurrentSystemPrompt() {
    const pronpt = this.currentSystemPrompt;
    if (pronpt) return pronpt.value;
    return "";
  }

  getSystemPromptTemplateItems() {
    // 選択肢用のデータに変換して渡す
    return systemDataToItem(this.systemPrompts);
  }
}

export const templateManager = new TemplateManager();
