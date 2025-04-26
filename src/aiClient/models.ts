import { Item } from "../template";

interface AiModels {
  name: string; // 実際に送信するモデル
  description: string;
}

export function modelsToItem(models: AiModels[]): Item[] {
  return models.map((item) => {
    return {
      text: item.name,
      value: item.name,
      preview: {
        text: item.description,
        ft: "markdown",
      },
    };
  });
}

export const claudeModels: AiModels[] = [
  {
    name: "claude-3-7-sonnet-latest",
    description:
      "最新のハイブリッド推論モデル。高度な推論能力と高速応答を両立。コード生成・リファクタリング対応モデル",
  },
  {
    name: "claude-3-5-sonnet-latest",
    description:
      "マルチステップ処理やコード生成に優れたバランス型モデル。バランスよくコードレビュー・生成向き",
  },
  {
    name: "claude-3-5-haiku-latest",
    description:
      "軽量かつ高速な応答が可能なモデル。リアルタイム処理に適している。高速・低コスト。ちょっとした保管やコーディングメモに最適",
  },
  {
    name: "claude-3-opus-20240304",
    description:
      "最も高性能なモデル。複雑なタスクや高度な言語理解に適している。複雑な設計・ライブラリ設計・アルゴリズム設計に最適",
  },
  {
    name: "claude-3-sonnet-20240304",
    description:
      "パフォーマンスとコストのバランスが取れたモデル。多用途に適している。",
  },
];

export const geminiModels: AiModels[] = [
  {
    name: "gemini-2.5-pro-001",
    description:
      "最高性能の推論モデル。高度なコードの生成・分析と複雑な文章作成に最適。長文コンテキストと高度な思考能力を持つ。アプリ版は無料で実験的に利用可能、API利用は有料。",
  },
  {
    name: "gemini-2.0-flash-001",
    description:
      "バランスの取れた高速モデル。一般的なコーディングと文章生成に優れた性能を発揮し、レスポンス速度に優れる。業界をリードする無料枠とレート制限あり。",
  },
  {
    name: "gemini-2.0-flash-lite-001",
    description:
      "最もコスト効率が高く低レイテンシーのモデル。基本的なコーディングと短い文章生成に適している。無料枠あり。",
  },
  {
    name: "gemini-1.5-pro-002",
    description:
      "幅広い推論タスクに最適化された多モードモデル。高品質なコード生成と詳細な文章作成に強み。テスト・実験用の無料枠あり（レート制限あり）。",
  },
  {
    name: "gemini-1.5-flash-002",
    description:
      "多様なタスクに適した高速で汎用性の高いモデル。基本的なコーディングと効率的な文章生成に適している。テスト・実験用の無料枠あり（レート制限あり）。",
  },
  {
    name: "gemini-1.5-flash-8b-001",
    description:
      "小規模な低計算コストモデル。シンプルなコーディングタスクや短い文章生成に適している。低レベルインテリジェンスタスク向け。",
  },
  {
    name: "gemini-1.0-pro-001",
    description:
      "基本的なコード生成とテキスト処理を行うNLPモデル。マルチターンの会話とコードチャットに対応。一部の地域で無料枠あり（レート制限あり）。",
  },
  {
    name: "text-embedding-004",
    description:
      "テキスト埋め込み生成用のモデル。コーディング・文章作成には非対応だが、セマンティック検索や分類に使用可能。",
  },
];
