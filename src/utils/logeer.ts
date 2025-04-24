import { OutputChannel, window } from "coc.nvim";

class Logger {
  private channel: OutputChannel;

  constructor(name: string) {
    this.channel = window.createOutputChannel(name);
  }

  info(message: string, data?: any): void {
    this.channel.append(`[INFO] ${message}\n`);
    if (data) {
      // データオブジェクトを適切に文字列化
      if (typeof data === "object") {
        this.channel.append(`${JSON.stringify(data, null, 2)}\n`);
      } else {
        this.channel.append(`${data}\n`);
      }
    }
  }

  error(message: string, error?: any): void {
    this.channel.append(`[ERROR] ${message}\n`);
    window.showErrorMessage(`[aiAssist] ${message}`)
    if (error) {
      // エラーオブジェクトを適切に文字列化
      if (typeof error === "object") {
        this.channel.append(`${JSON.stringify(error, null, 2)}\n`);
      } else {
        this.channel.append(`${error}\n`);
      }
    }
  }

  show(): void {
    this.channel.show();
  }
}

export const logger = new Logger("Claude Command");
