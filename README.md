# BTC Trade Analyzer

このプロジェクトは[Next.js](https://nextjs.org)を使用して構築されたバイナリーオプション取引分析ツールです。[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)を使用して作成されています。

## 機能

- バイナリーオプション取引の履歴分析
- 勝率と収益率の計算
- 取引パターンの可視化
- 時間帯別の勝率分析
- カスタマイズ可能なダッシュボード
- リスク管理指標の表示

## 開発環境のセットアップ

まず、開発サーバーを起動します：

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
# または
bun dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開くと、アプリケーションが表示されます。

`app/page.tsx` を編集することで、ページの内容を変更できます。ファイルを編集すると、ページは自動的に更新されます。

このプロジェクトでは、[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)を使用して、Vercelの新しいフォントファミリーである[Geist](https://vercel.com/font)を自動的に最適化して読み込んでいます。

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- Chart.js (グラフ表示)
- その他の主要なライブラリ

## 学習リソース

Next.jsについてさらに学ぶには、以下のリソースを参照してください：

- [Next.js ドキュメント](https://nextjs.org/docs) - Next.jsの機能とAPIについて学ぶ
- [Next.js チュートリアル](https://nextjs.org/learn) - インタラクティブなNext.jsチュートリアル

[Next.jsのGitHubリポジトリ](https://github.com/vercel/next.js)もご覧ください - フィードバックや貢献を歓迎します！

## デプロイ

このNext.jsアプリケーションをデプロイする最も簡単な方法は、Next.jsの開発元である[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)を使用することです。

詳細については、[Next.jsのデプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)を参照してください。
