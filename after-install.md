# HermesへのPonytail導入後

`--enable` なしでインストールした場合は、次で有効化します。

```bash
hermes plugins enable ponytail
```

有効化後にHermesまたはゲートウェイを再起動してください。

共有ゲートウェイでは、Hermesのスラッシュコマンドアクセス制御を使い、`/ponytail` を信頼できるユーザーだけに許可してください。実行時のモードはプロセス単位です。

コマンド：

- `/ponytail [lite|full|ultra|off]`
- `/ponytail-review [target]`
- `/ponytail-audit [target]`
- `/ponytail-debt`
- `/ponytail-gain`
- `/ponytail-help`

同梱スキルは `ponytail:ponytail`、`ponytail:ponytail-review`、`ponytail:ponytail-audit`、`ponytail:ponytail-debt`、`ponytail:ponytail-gain`、`ponytail:ponytail-help` として利用できます。
