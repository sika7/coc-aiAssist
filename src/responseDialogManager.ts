import { window, workspace } from "coc.nvim";
import { logger } from "./utils/logeer";

// ダイアログ管理クラス
export class ResponseDialogManager {
  private dialogWinId: number | null = null;
  private dialogBufferId: number | null = null;
  private isDialogOpen: boolean = false;

  constructor() {}

  // ダイアログを表示または更新する
  async showDialog(content: string): Promise<void> {
    logger.info("Showing response dialog");

    const nvim = workspace.nvim;

    // ダイアログが既に開いている場合は内容を更新
    if (this.isDialogOpen && this.dialogWinId && this.dialogBufferId) {
      try {
        // ウィンドウが存在するか確認
        const winExists =
          (await nvim.call("win_id2win", [this.dialogWinId])) > 0;

        if (winExists) {
          // バッファの内容を更新
          await nvim.call("nvim_buf_set_option", [
            this.dialogBufferId,
            "modifiable",
            true,
          ]);

          // バッファの内容をクリア
          await nvim.call("nvim_buf_set_lines", [
            this.dialogBufferId,
            0,
            -1,
            false,
            [],
          ]);

          // 新しい内容を設定
          const lines = content.split("\n");
          await nvim.call("nvim_buf_set_lines", [
            this.dialogBufferId,
            0,
            0,
            false,
            lines,
          ]);

          // バッファを読み取り専用に戻す
          await nvim.call("nvim_buf_set_option", [
            this.dialogBufferId,
            "modifiable",
            false,
          ]);

          // ウィンドウにフォーカス
          await nvim.call("win_gotoid", [this.dialogWinId]);

          logger.info("Updated existing dialog content");
          return;
        } else {
          // ウィンドウが存在しないので新しく作成
          this.isDialogOpen = false;
        }
      } catch (error) {
        logger.error("Error updating dialog", error);
        this.isDialogOpen = false;
      }
    }

    // 新しいダイアログを作成
    try {
      // フロートウィンドウのオプション
      const config = {
        title: "Claude Response",
        border: [1, 1, 1, 1],
        close: 1,
        rounded: true,
        shadow: true,
        highlight: "Normal",
        maxHeight: Math.floor(workspace.env.lines * 0.8),
        maxWidth: Math.floor(workspace.env.columns * 0.8),
        preferTop: false,
      };

      // フローティングウィンドウを作成
      const result = await nvim.call("coc#float#create_float_win", [
        0,
        0,
        config,
      ]);

      if (result && Array.isArray(result) && result.length >= 2) {
        this.dialogWinId = result[0];
        this.dialogBufferId = result[1];

        // コンテンツを設定
        await nvim.call("nvim_buf_set_option", [
          this.dialogBufferId,
          "modifiable",
          true,
        ]);
        const lines = content.split("\n");
        await nvim.call("nvim_buf_set_lines", [
          this.dialogBufferId,
          0,
          0,
          false,
          lines,
        ]);
        await nvim.call("nvim_buf_set_option", [
          this.dialogBufferId,
          "modifiable",
          false,
        ]);

        // バッファの種類をドキュメントに設定
        await nvim.call("nvim_buf_set_option", [
          this.dialogBufferId,
          "buftype",
          "nofile",
        ]);
        await nvim.call("nvim_buf_set_option", [
          this.dialogBufferId,
          "filetype",
          "markdown",
        ]);

        // q キーでダイアログを閉じる
        await nvim.call("nvim_buf_set_keymap", [
          this.dialogBufferId,
          "n",
          "q",
          ":CocCommand claude.toggleDialog<CR>",
          { noremap: true, silent: true, nowait: true },
        ]);

        // Esc キーでダイアログを閉じる
        await nvim.call("nvim_buf_set_keymap", [
          this.dialogBufferId,
          "n",
          "<Esc>",
          ":CocCommand claude.toggleDialog<CR>",
          { noremap: true, silent: true, nowait: true },
        ]);

        this.isDialogOpen = true;

        // ウィンドウにフォーカス
        await nvim.call("win_gotoid", [this.dialogWinId]);

        logger.info("Created new response dialog");
      } else {
        throw new Error("Failed to create float window");
      }
    } catch (error) {
      logger.error("Error creating dialog", error);
      throw error;
    }
  }

  // ダイアログを閉じる
  async closeDialog(): Promise<void> {
    if (this.dialogWinId) {
      try {
        const winExists =
          (await workspace.nvim.call("win_id2win", [this.dialogWinId])) > 0;
        if (winExists) {
          await workspace.nvim.call("coc#float#close", [this.dialogWinId]);
          window.showInformationMessage("Claude response dialog closed");
        }
      } catch (error) {
        logger.error("Error closing dialog", error);
      }

      this.isDialogOpen = false;
      // 完全にクローズしてもウィンドウIDは保持しておく
      // this.dialogWinId = null;
      // this.dialogBufferId = null;
    }
  }

  // ダイアログをトグルする
  async toggleDialog(content?: string): Promise<void> {
    if (this.isDialogOpen) {
      await this.closeDialog();
    } else if (content) {
      await this.showDialog(content);
    } else {
      window.showMessage("No content to display in dialog", "warning");
    }
  }

  // ダイアログが開いているか
  isOpen(): boolean {
    return this.isDialogOpen;
  }

  // 最後のレスポンス内容
  private lastResponse: string | null = null;

  // 最後のレスポンスを保存
  setLastResponse(content: string): void {
    this.lastResponse = content;
  }

  // 最後のレスポンスを取得
  getLastResponse(): string | null {
    return this.lastResponse;
  }
}
