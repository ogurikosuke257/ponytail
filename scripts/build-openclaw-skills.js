#!/usr/bin/env node
// Generate the OpenClaw / ClawHub skill package (.openclaw/skills/) from the
// canonical skills/. OpenClaw skills are SKILL.md (frontmatter + body), the same
// format ponytail already uses, with one difference: `description` must be a
// single line under 160 chars. The canonical descriptions are long (tuned for
// Claude's skill picker), so each ships a short one here. The body is copied
// verbatim from skills/<name>/SKILL.md so the ruleset never drifts; only the
// frontmatter is rewritten.
//
// Run:  node scripts/build-openclaw-skills.js
// tests/openclaw-skills.test.js fails if the committed copies are stale.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HOMEPAGE = 'https://github.com/DietrichGebert/ponytail';

const DESCRIPTIONS = {
  'ponytail': '任意のコーディングタスクで最小実装を選ぶ日本語モード。YAGNI、標準ライブラリ、標準機能を優先し、不要な抽象化を避ける。',
  'ponytail-review': '差分を過剰設計の観点でレビューし、削除・標準化できるものを指摘する。1行1指摘。',
  'ponytail-audit': 'リポジトリ全体を過剰設計の観点で監査し、削除・単純化候補を大きい順に出す。',
  'ponytail-debt': 'ponytail:ショートカットコメントを負債台帳へ集め、先送りを追跡する。1回限りの報告。',
  'ponytail-gain': 'ベンチマーク中央値からコード量・コスト・速度の効果をスコアボードで表示する。',
  'ponytail-help': 'Ponytailのモード、スキル、コマンドのクイックリファレンスを表示する。',
};

const NAMES = Object.keys(DESCRIPTIONS);

function sourceBody(name) {
  const src = fs.readFileSync(path.join(ROOT, 'skills', name, 'SKILL.md'), 'utf8').replace(/\r\n/g, '\n');
  const fm = src.match(/^---\n[\s\S]*?\n---\n?/);
  if (!fm) throw new Error(`skills/${name}/SKILL.md has no frontmatter`);
  return src.slice(fm[0].length);
}

function render(name) {
  const desc = DESCRIPTIONS[name];
  if (desc.length > 160 || desc.includes('\n') || desc.includes('"')) {
    throw new Error(`description for ${name} must be one line, no quotes, under 160 chars`);
  }
  const frontmatter =
    `---\nname: ${name}\ndescription: "${desc}"\nhomepage: ${HOMEPAGE}\nlicense: MIT\n---\n`;
  return frontmatter + sourceBody(name);
}

function outPath(name) {
  return path.join(ROOT, '.openclaw', 'skills', name, 'SKILL.md');
}

module.exports = { DESCRIPTIONS, NAMES, render, outPath, sourceBody };

if (require.main === module) {
  for (const name of NAMES) {
    const p = outPath(name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, render(name));
    console.log('wrote', path.relative(ROOT, p).replace(/\\/g, '/'));
  }
}
