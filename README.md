# coc-aiAssist

[coc.nvim](https://github.com/neoclide/coc.nvim)の拡張機能で、NeovimやVim内でAnthropicのClaudeAIモデルを直接利用できます。

## 機能

- Claudeにコードについての質問をして、フローティングウィンドウで回答を受け取る
- 異なるAIモデル（Claude 3.7 Sonnet、3.5 Sonnet、3.5 Haikuなど）を選択可能
- テンプレート選択によるクイックアシストと詳細アシスト
- 異なるユースケース向けのシステムプロンプト選択
- 過去の会話を確認するための履歴ビューア
- 例付きのプロンプトテンプレートシステム

## インストール

### 前提条件

- [Node.js](https://nodejs.org/en/) (>= 14.x)
- [coc.nvim](https://github.com/neoclide/coc.nvim) 拡張マネージャー
- [snacks.nvim](https://github.com/folke/snacks.nvim) lua製QOLプラグイン
- ClaudeモデルにアクセスするためのAnthropic APIキー

### coc.nvimでのインストール

```init.lua
require("lazy").setup({
  {
    'sika7/coc-aiAssist',
    dependencies = {
      'neoclide/coc.nvim',
      'folke/snacks.nvim',
    },
  },
})
```

## 設定

以下の設定をお好みに合わせて変更できます：

- `ANTHROPIC_API_KEY`: Anthropic APIキー（必須）
- `ANTHROPIC_API_MODEL`: 使用するClaudeモデル（デフォルト: "claude-3.7-sonnet-20250219"）
- `ANTHROPIC_API_MAX_TOKENS`: 応答の最大トークン数（デフォルト: 1000）

環境変数に設定するか`~/.config/nvim/.env` に設定してください

## コマンド

この拡張機能は以下のコマンドを提供します：

- `:CocCommand aiAssist.quickAssist`: インプット入力による素早い質問
- `:CocCommand aiAssist.detailedAssist`: テンプレート選択による詳細な質問
- `:CocCommand aiAssist.selectClient`: AIクライアントの選択
- `:CocCommand aiAssist.selectModel`: AIモデルの選択("claude-3.7-sonnet-20250219"など)
- `:CocCommand aiAssist.selectSystemPrompt`: システムプロンプトの選択
- `:CocCommand aiAssist.showHistory`: 会話履歴の表示
- `:CocCommand aiAssist.historyClear`: 会話履歴の削除
- `:CocCommand aiAssist.showExample`: プロンプトテンプレートの例を表示
- `:CocCommand aiAssist.writeExample`: プロンプトテンプレートの例を書き込む
- `:CocCommand aiAssist.log`: Claude拡張機能のログを表示

## プロンプトテンプレート

この拡張機能はカスタマイズ可能なプロンプトテンプレートをサポートしています。提供された設定例のファイルを基にして、 `~/.config/nvim/` に`prompt-template.yaml`ファイルを作成してください。

または `:CocCommand aiAssist.writeExample` コマンドでファイルが作成されます。

systemはAIがどのような振る舞いをするか
templatesはリクエストする文章のテンプレ

```yaml
# 構造例
version: "1.0"

system:
  - lavel: "Developer Assistant"
    value: "You are a helpful assistant for developers..."

templates:
  - template_type: "Normal"
    template: ""

  - template_type: "Code Only"
    template: "I need executable code only, no explanations..."
```

## 使用方法

### クイックアシスト

1. `:CocCommand aiAssist.quickAssist`を実行
2. 入力ボックスに質問を入力
3. Claudeが応答し、回答は履歴に保存されます

### 詳細アシスト

1. `:CocCommand aiAssist.detailedAssist`を実行
2. プロンプトテンプレートを選択
3. 質問を入力
4. Claudeがより詳細な回答をします

### 回答の表示

1. `:CocCommand aiAssist.showHistory`を実行
2. 質問を選択し回答を見ます
3. <c-j><c-k>で選択の移動エンターで大きく見れます

### モデル選択

1. `:CocCommand aiAssist.selectModel`を実行
2. 利用可能なClaudeモデルから選択
3. 選択したモデルが今後のリクエストに使用されます

### システムプロンプト選択

1. `:CocCommand aiAssist.selectSystemPrompt`を実行
2. 利用可能なシステムプロンプトから選択
3. 選択したシステムプロンプトがClaudeの動作を定義します

## ライセンス

MIT

---

> この拡張機能は[create-coc-extension](https://github.com/fannheyward/create-coc-extension)で構築されています
