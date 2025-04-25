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
