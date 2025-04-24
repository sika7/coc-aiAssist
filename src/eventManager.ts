import { window, workspace } from "coc.nvim";

type EventCallback = (value: string) => void;

interface Event {
  name: string;
  callback: EventCallback;
}

class EventManager {
  callbacks: Event[] = [];

  constructor() {
    this.init();
  }

  async init() {
    // イベントリスナ
    workspace.nvim.on("notification", (method: string, value: string) => {
      // CocAutocmdは頻繁だから除外
      if (method === "CocAutocmd") return;

      // aiAssist.[type] のみ実行する
      if (method.includes("aiAssist")) {
        this.callbacks
          .filter((item) => {
            return item.name === method;
          })
          .forEach((item) => {
            if (Array.isArray(value)) {
              value = value.join("");
            }
            item.callback(value);
          });

        // ユニークな名前で登録されるので実行したら捨てる
        this.unregisterCallback(method);

        // rcpで通知を送るとcocでActionがないとエラー表示される。
        // あんまり良くないが見栄えが悪いため通知で上書きする
        setTimeout(() => {
          window.showInformationMessage("aiAssist!!");
        }, 30);
      }
    });
  }

  registerCallback(name: string, callback: EventCallback) {
    // 複数登録しない
    if (this.callbacks.find((item) => item.name === name)) return;

    this.callbacks.push({
      name,
      callback,
    });
  }

  unregisterCallback(name: string) {
    this.callbacks = this.callbacks.filter((item) => {
      return item.name !== name;
    });
  }
}

export const eventManager = new EventManager();
