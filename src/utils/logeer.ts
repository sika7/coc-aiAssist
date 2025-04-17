import { OutputChannel, window } from "coc.nvim";

class Logger {
  private channel: OutputChannel;

  constructor(name: string) {
    this.channel = window.createOutputChannel(name);
  }

  info(message: string): void {
    this.channel.append(`[INFO] ${message}\n`);
  }

  error(message: string, error?: any): void {
    this.channel.append(`[ERROR] ${message}\n`);
    window.showErrorMessage(message)
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
