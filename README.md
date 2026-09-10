<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.png">
    <img src="assets/logo.png" width="220" alt="Ponytail、日本語の怠惰なシニア開発者モード">
  </picture>
</p>

<h1 align="center">Ponytail（日本語版）</h1>

<p align="center">
  <em>何も言わず、1行だけ書く。それで動く。</em>
</p>

<p align="center">
  <a href="https://github.com/ogurikosuke257/ponytail">ogurikosuke257/ponytail</a> ·
  <a href="https://github.com/DietrichGebert/ponytail">原著リポジトリ</a> · MIT License
</p>

Ponytailは、AIエージェントに「怠惰なシニア開発者」の判断基準を与えるスキル／プラグインです。怠惰とは雑に作ることではありません。問題を理解したうえで、最初に成立する最小の解決策を選ぶことです。

## 何をするか

コードを書く前に、次の段階を上から確認します。

```text
1. そもそも必要か？                         → 不要なら作らない（YAGNI）
2. このコードベースに既にあるか？           → 再利用する
3. 標準ライブラリでできるか？               → 標準ライブラリを使う
4. プラットフォーム標準機能でできるか？     → 標準機能を使う
5. 導入済みの依存関係でできるか？           → それを使う
6. 1行で書けるか？                          → 1行にする
7. それでも必要なら                         → 動く最小限を書く
```

理解、信頼境界の入力検証、データ損失を防ぐ処理、セキュリティ、アクセシビリティ、実機の調整、明示的な要求は省略しません。

## ベンチマーク

元プロジェクトの公開ベンチマークでは、実際のClaude Codeセッションを使った12個の機能タスクで、Ponytailはスキルなしの基準と比べて平均でコード量54%、トークン22%、コスト20%、時間27%を削減し、安全性は100%でした。これは元プロジェクトの測定値であり、このforkや個別のリポジトリの保証値ではありません。詳細は [`benchmarks/results/2026-06-18-agentic.md`](benchmarks/results/2026-06-18-agentic.md) を参照してください。

## このforkの使い方

clone済みのローカル版を、対象プロジェクトのプラグインまたはルールとして指定できます。

```bash
git clone https://github.com/ogurikosuke257/ponytail.git ~/oguri/ponytail
```

Claude Code／Codexでマーケットプレイスとして登録する場合：

```text
/plugin marketplace add ogurikosuke257/ponytail
/plugin install ponytail@ponytail
```

Codex CLIでは次を使います。

```bash
codex plugin marketplace add ogurikosuke257/ponytail
codex plugin add ponytail@ponytail
```

ローカルチェックアウトを直接使う場合は、`AGENTS.md` と `skills/` を対象プロジェクトへ読み込ませます。Claude Code、Codex、Gemini、Qoder、Cursor、Windsurf、Cline、GitHub Copilotなどのホスト向けコピーも同梱しています。

## 対応ホスト

- Claude Code：マーケットプレイスからインストールすると、ライフサイクルフックと6つのスキルが有効になります。
- Codex：プラグインとしてインストールし、`/hooks` でフックを確認して新しいスレッドを開始します。
- Pi：`pi install git:github.com/ogurikosuke257/ponytail`。同梱拡張がモードとコマンドを提供します。
- OpenCode：`opencode.json` の `plugin` に `./.opencode/plugins/ponytail.mjs` を指定します。
- Gemini CLI：`gemini extensions install https://github.com/ogurikosuke257/ponytail`。`AGENTS.md` と `commands/`、`skills/` を再利用します。
- Qoder：ルートの `AGENTS.md` を常時ルールとして読み込み、`.qoder-plugin/` と `hooks/qoder-hooks.json` でスキルとフックを使えます。
- Hermes Agent：`hermes plugins install ogurikosuke257/ponytail --enable`。同梱スキルは `ponytail:<skill>` で利用できます。
- MCPホスト：[`ponytail-mcp/`](ponytail-mcp/) のMCPサーバーをプロンプトまたは読み取り専用ツールとして登録します。

詳細なホスト別の対応表は [`docs/agent-portability.md`](docs/agent-portability.md) を参照してください。

## モードとコマンド

| コマンド | 内容 |
|---|---|
| `/ponytail lite` | 要求されたものを作り、怠惰な代替案を1行で示す。 |
| `/ponytail` | YAGNI → 標準ライブラリ → 標準機能 → 1行 → 最小実装。既定値。 |
| `/ponytail ultra` | 追加より削除を優先し、作る前に要件へ問いを返す。 |
| `/ponytail off` | 自動注入を停止する。 |
| `/ponytail-review` | 現在の差分の過剰設計だけをレビューする。 |
| `/ponytail-audit` | リポジトリ全体の過剰設計を監査する。 |
| `/ponytail-debt` | `ponytail:` コメントを負債台帳に集める。 |
| `/ponytail-gain` | 公開ベンチマークの効果を表示する。 |
| `/ponytail-help` | コマンドと設定のクイックリファレンスを表示する。 |

Codexでは対応するスキルを `@ponytail` の形式でも呼び出せます。

## 既定モードの設定

環境変数が最優先で、次に設定ファイル、最後に `full` が使われます。

```bash
export PONYTAIL_DEFAULT_MODE=ultra
```

```json
// ~/.config/ponytail/config.json
{ "defaultMode": "lite" }
```

利用可能な値は `off`、`lite`、`full`、`ultra` です。モード変更を保存するかどうかはホストの実装に従います。

## 日本語化の方針

このforkは、元プロジェクトの互換性を保ちながら段階的に日本語化します。

今回の第1段階では、実行時にエージェントへ届く中核を対象にしました。

- `AGENTS.md` と各ホスト用のルールコピー
- `skills/` の6スキル
- `commands/` と `.opencode/command/` の6コマンド
- Claude／Codexフックのフォールバック文、Pi、Hermes、MCPの表示文
- プラグインの説明文とこのREADME

コマンド名、スキル名、モード名、環境変数、設定キー、ファイルパス、JSONキー、出力の機械判定用タグは互換性のため変更していません。ベンチマークの生データ、過去のモデル出力、サンプルコード内の英語コメントは、測定・比較の再現性を保つため次段階で扱います。進捗と次の翻訳単位は [`docs/japanese-localization.md`](docs/japanese-localization.md) に記録します。

## 開発とテスト

依存関係を追加せずに、Node.jsの組み込みテストランナーで検証できます。

```bash
npm test
```

MCPサブプロジェクトの依存関係が必要な場合は、先に `npm install --prefix ponytail-mcp` を実行してください。

OpenClaw用の生成コピーを更新する場合：

```bash
node scripts/build-openclaw-skills.js
```

## ライセンスと帰属

元プロジェクトのMIT Licenseを維持しています。著作権表示とライセンス条件は [`LICENSE`](LICENSE) を確認してください。元プロジェクトは [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) です。
