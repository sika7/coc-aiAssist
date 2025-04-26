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

export const chatGtpModels: AiModels[] = [
  {
    name: "gpt-4.1",
    description:
      "最新世代のハイエンドモデル。コーディング、指示追従、長文コンテキスト理解に優れた性能。100万トークンの入力と3万2千トークンの出力をサポート。コーディングベンチマークでGPT-4oを21%上回る。APIのみで利用可能。",
  },
  {
    name: "gpt-4.1-mini",
    description:
      "GPT-4.1の小型版。多くのベンチマークでGPT-4oを上回りながら、レイテンシーを半分に削減し、コストを83%削減。100万トークンコンテキスト対応。",
  },
  {
    name: "gpt-4.1-nano",
    description:
      "OpenAIの最も高速かつ低コストなモデル。分類や自動補完などに最適。100万トークンのコンテキストウィンドウを持ちながら、優れたパフォーマンスを実現。",
  },
  {
    name: "gpt-4o",
    description:
      "テキスト、画像、音声を統合した多モーダルモデル。GPT-4 Turboと同等の英語テキストとコーディング能力を持ちつつ、非英語と視覚タスクで優れたパフォーマンスを発揮。",
  },
  {
    name: "gpt-4o-mini",
    description:
      "GPT-4oの小型版。コスト効率に優れ、基本的なタスクに適したモデル。",
  },
  {
    name: "o1",
    description:
      "推論に特化したモデルシリーズ。科学、コーディング、数学など複雑な問題解決タスクに強い。20万トークンのコンテキスト対応。",
  },
  {
    name: "o3-mini",
    description:
      "コーディング、数学、科学のユースケースに特化した高速で効率的な推論モデル。20万トークンの入力と10万トークンの出力に対応。",
  },
  {
    name: "gpt-4-turbo",
    description:
      "テキストまたは画像入力を受け付け、複雑な問題を高精度で解決できる大規模多モーダルモデル。チャット最適化済み。",
  },
  {
    name: "gpt-3.5-turbo",
    description:
      "対話に最適化された効率的なモデル。チャットボットアプリケーションや会話インターフェースに理想的。テキスト生成が最も高速で費用対効果が高い。",
  },
];

export const perplexityModels: AiModels[] = [
  {
    name: "llama-3.1-sonar-small-128k-online",
    description:
      "高速で効率的な検索モデル。基本的な質問応答に最適化されており、コスト効率に優れている。リアルタイム検索機能を備え、引用付きの回答を生成。",
  },
  {
    name: "llama-3.1-sonar-large-128k-online",
    description:
      "複雑なクエリとより深いコンテンツ理解に最適化された高度な検索モデル。GPT-4o miniやClaude 3.5 Haikuを大幅に上回るパフォーマンスを提供。",
  },
  {
    name: "llama-3.1-sonar-huge-128k-online",
    description:
      "多段階の推論、問題解決、およびリアルタイム検索に最適化された高性能モデル。GPT-4oと同等の性能を持ちながら、処理速度が10倍以上速い。",
  },
  {
    name: "sonar-large-32k",
    description:
      "Llama 3.4をベースにした簡潔さと正確さを重視したモデル。Perplexityの検索エンジンとシームレスに連携するよう社内で訓練されている。",
  },
  {
    name: "sonar-pro",
    description:
      "より高度な多段階クエリ処理能力を持ち、検索結果の引用数がSonarの2倍。事実性に関するSimpleQAベンチマークでF-score 0.858を達成。",
  },
  {
    name: "gpt-4-omni",
    description:
      "[Perplexity Proサブスクリプション]OpenAIのGPT-4 Omni。最新のテキスト、画像、音声処理能力を備えた高度なモデル。",
  },
  {
    name: "claude-3.5-sonnet",
    description:
      "[Perplexity Proサブスクリプション]Anthropicの最新モデル。微妙な言語タスクの処理に優れ、速度と精度のバランスが良い。",
  },
  {
    name: "claude-3.5-haiku",
    description:
      "[Perplexity Proサブスクリプション]Anthropicの軽量かつ高速なモデルで、基本的なタスクに対応。",
  },
  {
    name: "o13",
    description:
      "[Perplexity Proサブスクリプション]複雑な推論タスクに特化したOpenAIのモデル。コーディング、高度な数学、科学研究に優れた能力を発揮。",
  },
  {
    name: "deepseek-r1",
    description:
      "[Perplexity Proサブスクリプション]論理的推論、数学的問題解決、リアルタイム意思決定に特化したコスト効率の高いオープンソースモデル。",
  },
  {
    name: "gemini-pro",
    description:
      "[Perplexity Proサブスクリプション]Googleの最新AIモデル。リアルタイム機能を備え、日常的なタスクに適している。",
  },
];
