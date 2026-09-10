# ponytail-mcp

Ponytailの怠惰なシニア開発者指示を提供するMCPサーバーです。Claude hooksやPi拡張と同じルールを使うため、どのホストでも同じ内容を出力します。

常時有効なアダプターの代替ではありません。Ponytailは通常、毎ターンのシステムコンテキストに入ります。MCPのプロンプトはユーザーが呼び出すもので、すべてのホストに共通する「毎ターン注入」のMCPプリミティブはありません。そのため、プロンプトメニューだけが注入点のホストや、ツール経由でコンテキストを取得するホスト向けの選択肢です。

## 提供するもの

- `ponytail` プロンプト：ルールをユーザーメッセージとして返します。`mode` は任意で、`lite`、`full`、`ultra` を指定できます。省略すると設定済みの既定値を使います。
- `ponytail_instructions` ツール：同じテキストを返し、ツールやコード実行から扱える `structuredContent`（`{ mode, instructions }`）も返します。読み取り専用です。

モード解決は `hooks/ponytail-config.js` を再利用します。`PONYTAIL_DEFAULT_MODE` と `~/.config/ponytail/config.json` は他のアダプターと同じように使えます。

## 起動

```bash
cd ponytail-mcp
npm install
node index.js        # stdioでMCPを提供
```

MCPホストからこのコマンドを指定します。クライアント設定の例：

```json
{ "mcpServers": { "ponytail": { "command": "node", "args": ["ponytail-mcp/index.js"] } } }
```

## テスト

```bash
npm test
```

モード解決と指示文を検証します。`index.js` のMCP配線は意図的に薄く、プロンプトとツールを `buildInstructions` に接続するだけです。
