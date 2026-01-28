<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ArticleGeneratorService
{
    private string $apiKey;
    private string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        // gemini-2.5-flash を使用（2025年6月リリースの最新安定版）
        $this->apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    }

    /**
     * 生のテキストから初学者向けの記事を生成
     */
    public function generateArticle(string $rawContent, string $title): string
    {
        $prompt = $this->buildPrompt($rawContent, $title);

        try {
            $response = Http::timeout(60)->post(
                $this->apiUrl . '?key=' . $this->apiKey,
                [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ]
                ]
            );

            if ($response->failed()) {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new \Exception('記事生成に失敗しました: ' . $response->body());
            }

            $result = $response->json();

            if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                return $result['candidates'][0]['content']['parts'][0]['text'];
            }

            throw new \Exception('記事生成に失敗しました: 予期しないレスポンス形式');

        } catch (\Exception $e) {
            Log::error('Article Generation Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * プロンプトを構築
     */
    private function buildPrompt(string $rawContent, string $title): string
    {
        return <<<PROMPT
あなたはプログラミング初学者向けの技術記事を書くライターです。

以下のタイトルと元ネタを使って、初学者にもわかりやすい技術記事を作成してください。

【タイトル】
{$title}

【元ネタ（コピペしたメモや断片的な情報）】
{$rawContent}

【記事作成の要件】
1. プログラミング初学者でも理解できるように、専門用語は噛み砕いて説明してください
2. 段階的に説明し、つまずきやすいポイントには注意書きを入れてください
3. 実例やコード例を含めて、実践的な内容にしてください
4. 以下のマークダウン記法を使って、読みやすく整形してください：
   - 見出しは ## と ### を使用
   - 重要な箇所は **太字** で強調
   - コードブロックは ```言語名 で囲む
   - 注意点は > を使った引用形式で記述
   - リストは - や 1. を使用
5. 文章は「です・ます」調で、親しみやすいトーンで書いてください
6. 記事の構成は以下のようにしてください：
   - 導入（この記事で何を学べるか）
   - 本文（段階的な説明）
   - まとめ（学んだことの振り返り）

それでは、上記の要件に従って記事を作成してください。
PROMPT;
    }
}
