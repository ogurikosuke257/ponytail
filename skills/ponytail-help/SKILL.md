---
name: ponytail-help
description: >
  Ponytailの全モード、スキル、コマンドを確認するためのカード。1回限りの表示で永続モードではない。/ponytail-help、「ponytailの使い方」「ponytailのコマンドは何か」「使い方を教えて」で使う。
---

# Ponytail ヘルプ

呼び出されたらこのリファレンスカードを表示します。1回限りです。モード変更、フラグファイルへの書き込み、永続化は **絶対にしません**。

## レベル

| レベル | 起動方法 | 変更内容 |
|-------|---------|---------|
| **Lite** | `/ponytail lite` | 要求されたものを作り、1行でより怠惰な代替案を示す。 |
| **Full** | `/ponytail` | YAGNI → 標準ライブラリ → 標準機能 → 1行 → 最小実装の段階表を適用する。既定値。 |
| **Ultra** | `/ponytail ultra` | YAGNIを徹底し、追加より削除を優先する。作る前に要件へ問いを返す。 |

レベルは変更またはセッション終了まで維持します。

## スキル

| スキル | 起動方法 | 内容 |
|--------|---------|------|
| **ponytail** | `/ponytail` | Ponytail本体。動く最小の解決策を選ぶ。 |
| **ponytail-review** | `/ponytail-review` | 過剰設計レビュー。`L42: yagni: ファクトリ、製品1つ。インライン化。` |
| **ponytail-audit** | `/ponytail-audit` | リポジトリ全体の過剰設計監査。削除候補を大きい順に出す。 |
| **ponytail-debt** | `/ponytail-debt` | `ponytail:` ショートカットコメントを台帳へ集める。 |
| **ponytail-gain** | `/ponytail-gain` | 測定済み効果のスコアボード。コード量、コスト、速度を表示する。 |
| **ponytail-help** | `/ponytail-help` | このカード。 |

Codexでは `@ponytail`、`@ponytail-review`、`@ponytail-help` を使います。Claude CodeとOpenCodeでは上記のスラッシュコマンドを使います（OpenCodeは6つすべてを提供します）。

## 無効化

`stop ponytail` または `normal mode` と言ってください。`/ponytail` でいつでも再開できます。`/ponytail off` でも無効化できます。

## 既定レベルの設定

既定値は `full` で、毎セッション自動的に有効になります。変更方法は次のとおりです。

**環境変数**（最優先）：

```bash
export PONYTAIL_DEFAULT_MODE=ultra
```

**設定ファイル**（`~/.config/ponytail/config.json`、Windowsでは `%APPDATA%\ponytail\config.json`）：

```json
{ "defaultMode": "lite" }
```

`off` にするとセッション開始時の自動有効化を止め、必要なときに `/ponytail` で手動起動できます。

解決順序は、環境変数 → 設定ファイル → `full` です。

## 更新

Claude Codeでは `/plugin` を開き、MarketplacesからPonytailを選んで自動更新を有効にします。手動更新は `/plugin marketplace update ponytail` の後に `/reload-plugins` です。

`/plugin` が認識されない場合はClaude Codeを更新して再起動してください。他のホストでは各ホストの更新手順を使います。

## 詳細

詳細な導入手順と例は、[README](../README.md) と `docs/` を参照してください。
