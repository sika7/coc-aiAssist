import { Disposable, MapMode, workspace } from "coc.nvim";
import { logger } from "./logeer";

// ダイアログインスタンスクラス
export class DialogInstance {
  private closeCallbacks: Array<() => void> = [];
  private disposables: Disposable[] = [];

  constructor(
    public readonly id: string,
    private win: any, // FloatWin
    public readonly bufferId: number,
  ) {}

  /**
   * ダイアログを閉じる
   */
  public async close(): Promise<void> {
    try {
      // 登録されているdisposablesをクリーンアップ
      this.disposables.forEach((d) => d.dispose());
      this.disposables = [];

      // ウィンドウを閉じる
      await this.win.close();

      // クローズコールバックを呼び出す
      this.closeCallbacks.forEach((callback) => callback());
      this.closeCallbacks = [];
    } catch (error) {
      logger.error(
        `ダイアログ "${this.id}" を閉じる際にエラーが発生しました:`,
        error,
      );
    }
  }

  /**
   * ダイアログが閉じられたときに呼び出されるコールバックを登録
   * @param callback コールバック関数
   */
  public onClose(callback: () => void): void {
    this.closeCallbacks.push(callback);
  }

  /**
   * キーマッピングを登録する
   * @param modes モード（'n', 'i'など）
   * @param key キー名
   * @param fn コールバック関数
   * @param options オプション
   */
  public registerKeymap(
    modes: MapMode[],
    key: string,
    fn: () => Promise<void>,
    options: { sync?: boolean; silent?: boolean } = {},
  ): void {
    const disposable = workspace.registerKeymap(modes, key, fn, {
      ...options,
    });

    this.disposables.push(disposable);

    // キーマッピングを設定
    const nvim = workspace.nvim;
    nvim.command(
      `nnoremap <silent><buffer><nowait><Esc> :call CocAction('do', 'dialog-escape')<CR>`,
      true,
    );
  }

  /**
   * Disposableを登録する
   * @param disposable 登録するDisposable
   */
  public registerDisposable(disposable: Disposable): void {
    this.disposables.push(disposable);
  }
}
