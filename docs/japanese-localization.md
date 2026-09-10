# 日本語化の進捗と取り込み方針

このforkは、DietrichGebert/ponytailの設計とホスト互換性を保ったまま、エージェントへ渡す自然言語を日本語へ段階的に置き換えるための作業用です。

## 第1段階（完了）

実行経路に直結する自然言語を日本語化しました。

- `AGENTS.md` とCursor、Windsurf、Cline、Qoder、Copilot、Kiro用のルールコピー
- `skills/ponytail*/SKILL.md` の6スキル
- `commands/*.toml` と `.opencode/command/*.md` の6コマンド
- `.openclaw/skills/` の生成コピー
- Claude／Codexフックのフォールバック、Hermes、Pi、MCPのユーザー向け文言
- README、インストール後の案内、主要マニフェストの説明文

## 互換性の境界

次は変更しません。

- コマンド名、スキル名、モード名
- `PONYTAIL_*` 環境変数と `defaultMode` などの設定キー
- JSON／YAML／TOMLのキー、ファイルパス、ホストが読むfrontmatter
- `/ponytail` の出力を機械判定する英語のタグ（`delete`、`stdlib`、`native`、`yagni`、`shrink`）
- MIT Licenseの著作権表示と元プロジェクトへの帰属

自然言語の翻訳によって、ホストの検出や既存の設定ファイルを壊さないことを優先します。

## 次の段階

次は小さい単位で検証しながら進めます。

1. `docs/agent-portability.md` と `docs/platform-native.md` を日本語化する。
2. `examples/` の説明文と見出しを日本語化する。コードとベンチマーク出力はそのまま残す。
3. `benchmarks/README.md` とベンチマーク実行手順を日本語化する。数値、プロンプト識別子、再現条件は変更しない。
4. 過去のベンチマーク結果とモデル出力は、原文を保持した日本語要約を別ファイルで追加する。
5. 実際のOguri側で必要なスキルだけを選び、`myapp/data/prompts/` または対応するルールへ取り込む。

各段階で `npm test` と、対象ホストのスモークテストを実行します。翻訳だけの変更でも、スキル本文と生成コピーの同期を確認します。
