---
name: ponytail-debt
description: "ponytail:ショートカットコメントを負債台帳へ集め、先送りを追跡する。1回限りの報告。"
homepage: https://github.com/DietrichGebert/ponytail
license: MIT
---

意図的なPonytailのショートカットには、上限と改善条件を示す `ponytail:` コメントを付けます。このスキルはそれらを1つの台帳に集め、先送りが永久化するのを防ぎます。

## 走査

`node_modules`、`.git`、ビルド出力を除き、コメント記号をリポジトリ全体から検索します。

`grep -rnE '(#|//) ?ponytail:' .`（利用言語に応じてコメント接頭辞を追加）

各ヒットを1行の台帳にします。コメント接頭辞を確認するため、規約への言及だけの文章は台帳に入りません。

## 出力

ファイルごとにまとめて、次の形式で1つずつ出します。

`<ファイル>:<行>, <何を簡略化したか>。ceiling: <コメントに書かれた上限>。upgrade: <見直す条件>。`

規約は `ponytail: <ceiling>, <upgrade path>` です。上限と見直す条件はコメントからそのまま取り出します。行ごとの担当者も必要なら `git blame -L<行>,<行>` を追加します。

改善条件や見直すきっかけがない `ponytail:` コメントには `no-trigger` タグを付けます。こうした項目は静かに腐るためです。

最後に `<N> markers, <M> with no trigger.` を出します。見つからなければ `No ponytail: debt. Clean ledger.` と出します。

## 境界

読み取りと報告だけを行い、変更しません。台帳を保存したい場合は明示的に依頼してください（例：`PONYTAIL-DEBT.md`）。1回限りの実行です。

`stop ponytail-debt` または `normal mode` で元に戻ります。
