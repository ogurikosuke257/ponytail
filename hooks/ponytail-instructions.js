#!/usr/bin/env node
// Shared Ponytail instruction builder for Claude hooks and Pi extension.

const fs = require('fs');
const path = require('path');
const { DEFAULT_MODE, normalizeMode, normalizePersistedMode } = require('./ponytail-config');

const INDEPENDENT_MODES = new Set(['review']);
const SKILL_PATH = path.join(__dirname, '..', 'skills', 'ponytail', 'SKILL.md');

function filterSkillBodyForMode(body, mode) {
  const effectiveMode = normalizeMode(mode) || DEFAULT_MODE;
  const withoutFrontmatter = String(body || '').replace(/^---[\s\S]*?---\s*/, '');

  // Only the intensity table rows and worked examples are mode-specific, and
  // both are keyed by a mode name (lite/full/ultra). A bullet whose label is
  // not a mode — e.g. "No unrequested abstractions: ..." — is a normal rule
  // and must be kept verbatim.
  return withoutFrontmatter
    .split(/\r?\n/)
    .filter((line) => {
      const tableLabel = line.match(/^\|\s*\*\*(.+?)\*\*\s*\|/);
      if (tableLabel) {
        const labelMode = normalizeMode(tableLabel[1].trim());
        if (labelMode) return labelMode === effectiveMode;
      }

      // Require a quoted value: every worked example is `- lite: "..."`. Without
      // this, an ordinary rule bullet that happens to start with a mode word
      // (e.g. "- Full: ...") is silently dropped in every other mode — it looks
      // like a worked example but is really prose meant to survive verbatim.
      const exampleLabel = line.match(/^-\s*([^:]+):\s*"/);
      if (exampleLabel) {
        const labelMode = normalizeMode(exampleLabel[1].trim());
        if (labelMode) return labelMode === effectiveMode;
      }

      return true;
    })
    .join('\n');
}

function getFallbackInstructions(mode) {
  return 'PONYTAIL MODE ACTIVE — level: ' + mode + '\n\n' +
    'あなたは怠惰なシニア開発者です。怠惰とは無責任ではなく効率的であることです。書かずに済むコードが、最良のコードです。\n\n' +
    '## 継続\n\n' +
    'すべての応答で有効です。過剰実装へ戻らないでください。無効化は「ponytailを止めて」／"stop ponytail"／"normal mode" のみです。\n\n' +
    '現在のレベル: **' + mode + '**。切り替え: `/ponytail lite|full|ultra`。\n\n' +
    '## 段階表\n\n' +
    '問題を理解し、変更対象のコードを読み、実際の流れを追ってから、最初に成立する段階で止めます。\n' +
    '1. そもそも作る必要があるか？（YAGNI）\n' +
    '2. このコードベースに既にあるか？既存のものを再利用し、書き直さない。\n' +
    '3. 標準ライブラリでできるか？使う。\n' +
    '4. プラットフォーム標準機能でできるか？使う。\n' +
    '5. 既に導入済みの依存関係でできるか？使う。\n' +
    '6. 1行で書けるか？1行にする。\n' +
    '7. それでも必要なら、動くための最小限を書く。\n\n' +
    'バグ修正は症状ではなく根本原因を直します。触る関数の呼び出し元をすべて検索し、共有関数を一度だけ直します。\n\n' +
    '## ルール\n\n' +
    '要求されていない抽象化、避けられる依存関係、頼まれていないボイラープレートを追加しません。追加より削除、賢さより退屈さ、最小のファイル数を選びます。' +
    '複雑な依頼には同じ応答で問いを返し、同じサイズの標準ライブラリ案では境界条件に正しい方を選びます。' +
    '既知の上限を持つ簡略化には、上限と改善条件を示す `ponytail:` コメントを付けます。\n\n' +
    '## 出力\n\n' +
    'コードを先に出します。その後は最大3行で、何を省いたかと、いつ追加するかだけを書きます。' +
    'ユーザーが明示的に求めた説明は省略しません。\n\n' +
    '## 怠惰にしてはいけない場合\n\n' +
    '問題の理解、信頼境界の入力検証、データ損失を防ぐエラー処理、セキュリティ、アクセシビリティ、実機のキャリブレーション、明示的に要求されたものは簡略化しません。' +
    '怠惰なコードはチェックなしでは未完成です。非自明なロジックには実行可能なチェックを1つ残します。単純な1行にはテスト不要です。\n\n' +
    '## 境界\n\n' +
    'Ponytailが決めるのは何を作るかであり、話し方ではありません。"stop ponytail" または "normal mode" で元に戻ります。レベルは変更またはセッション終了まで維持します。';
}

function getPonytailInstructions(mode) {
  const configuredMode = normalizePersistedMode(mode) || DEFAULT_MODE;

  if (INDEPENDENT_MODES.has(configuredMode)) {
    return 'PONYTAIL MODE ACTIVE — level: ' + configuredMode + '. Behavior defined by /ponytail-' + configuredMode + ' skill.';
  }

  const effectiveMode = normalizeMode(configuredMode) || DEFAULT_MODE;

  try {
    return 'PONYTAIL MODE ACTIVE — level: ' + effectiveMode + '\n\n' +
      filterSkillBodyForMode(fs.readFileSync(SKILL_PATH, 'utf8'), effectiveMode);
  } catch (e) {
    return getFallbackInstructions(effectiveMode);
  }
}

module.exports = {
  filterSkillBodyForMode,
  getFallbackInstructions,
  getPonytailInstructions,
};
