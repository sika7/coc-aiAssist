import { readYamlFile } from "./utils/config";
import {
  getPluginFilePath,
  getStdPath,
  notis,
  readFile,
  writeFileIfNotExistsAsync,
} from "./utils/utils";
import { logger } from "./utils/logeer";

type Template = {
  template_type: string;
  template: string;
};

interface promptTemplate {
  version: string;
  templates: Template[];
}

export interface Item {
  text: string;
  value: string; // 選択時に返却されるデータ
  preview?: {
    text: string;
    ft: string;
  };
}

function fileDataToTemplate(data: promptTemplate): Item[] {
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

class TemplateManager {
  templates: Item[] = [];

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
      const promptTemplate = readYamlFile<promptTemplate>(yamlPath);

      this.templates = fileDataToTemplate(promptTemplate);
    } catch (error) {
      logger.error("プロンプトテンプレートの読み込みに失敗しました", error);
    }
  }

  getItems() {
    return this.templates;
  }
}

export const templateManager = new TemplateManager();
