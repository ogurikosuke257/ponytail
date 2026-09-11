#!/usr/bin/env node
// Ponytail MCPサーバー: 怠惰なシニア開発者ルールをstdio経由で
// プロンプト（ユーザー起動）とツール（ツール経由でコンテキストを取得するホスト向け）として提供する。
// 常時有効なアダプターの代替ではなく、プロンプトメニューだけが注入点のホスト向けの選択肢。
import fs from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

import { MODES, buildInstructions, resolveMode } from "./instructions.js";

const { version } = JSON.parse(
  await fs.promises.readFile(new URL("../package.json", import.meta.url), "utf8")
);
const server = new McpServer({ name: "ponytail", version });

const modeArg = z
  .enum(MODES)
  .optional()
  .describe("Ponytail intensity: lite, full, or ultra. Omit for the configured default.");

server.registerPrompt(
  "ponytail",
  {
    title: "Ponytail mode",
    description: "怠惰なシニア開発者の指示: YAGNI、標準ライブラリ優先、動く最小の変更。",
    argsSchema: { mode: modeArg },
  },
  ({ mode }) => ({
    messages: [{ role: "user", content: { type: "text", text: buildInstructions(mode) } }],
  }),
);

server.registerTool(
  "ponytail_instructions",
  {
    title: "Ponytail instructions",
    description: "指定された強度（lite、full、ultra）のPonytailルールを返す。",
    inputSchema: { mode: modeArg },
    outputSchema: { mode: z.string(), instructions: z.string() },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  ({ mode }) => {
    const resolvedMode = resolveMode(mode);
    const instructions = buildInstructions(resolvedMode);
    const structuredContent = { mode: resolvedMode, instructions };
    return { content: [{ type: "text", text: instructions }], structuredContent };
  },
);

await server.connect(new StdioServerTransport());
