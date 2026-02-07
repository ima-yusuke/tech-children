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
   - 大見出しは ## を使用し、「1. 見出し名」「2. 見出し名」のように数字と . をつける
   - 小見出しは ### を使用（数字は不要）
   - **太字** は本当に重要な箇所のみに使用し、多用しないこと（1段落に1箇所程度を目安に）
   - コードブロックは ```言語名 で囲む
   - 注意点は > を使った引用形式で記述
   - データの流れ、手順、プロセスなど順序を説明する場合は、必ず連番リスト（1. 2. 3.）を使用してわかりやすく
   - 単なる並列の項目は - を使用
5. 文章は「です・ます」調で、親しみやすいトーンで書いてください
6. 記事の構成は以下のようにしてください：
   - 冒頭に「**この記事で学べること**」というセクションを設け、大見出し（##の見出し）を1. 2. 3. の形式で箇条書きにした目次を表示してください
   - 導入（この記事で何を学べるか）
   - 本文（段階的な説明）
   - まとめ（学んだことの振り返り）
7. **行間と可読性について：**
   - 段落と段落の間には必ず空行（改行2回）を入れてください
   - 見出しの前後にも空行を入れてください
   - コードブロックの前後にも空行を入れてください
   - リストや引用の前後にも空行を入れてください
   - 適度な改行で、視覚的に読みやすい記事にしてください
8. **装飾について：**
   - 色や派手な装飾は使用しない
   - シンプルに太字とフォントサイズだけで強調する
   - Noteのような洗練されたシンプルなスタイルを意識してください

それでは、上記の要件に従って記事を作成してください。
PROMPT;
    }
}
