import { mkdirSync, writeFileSync } from "node:fs";
import { isAbsolute, join, resolve } from "node:path";

// 定稿：用客服工单的编号逻辑把“辞职”写成一次升级请求，转折更具体。
const ENTRY: string = "Dear HR, please close my ticket: I am escalating myself to a manager who does not have to answer to me.";

/**
 * 解析 harness 提供的输出目录；空值或未设置时回退到 /output。
 * 相对路径按当前工作目录解析，避免把目录字符串直接拼接为文件。
 */
function resolveOutputDir(raw: string | undefined): string {
  if (!raw || raw.trim().length === 0) return resolve("/output");
  return isAbsolute(raw) ? resolve(raw) : resolve(process.cwd(), raw);
}

/**
 * 门控文本的公共约束，便于本地测试与正式写入共用同一份规则。
 */
interface EntryLimits {
  maxPoints: number;
}

const LIMITS: EntryLimits = { maxPoints: 140 };

/**
 * 校验 UTF-8 单行文本：至少一个码点，非纯空白，且无换行、NUL、BOM 等控制字符。
 */
function isCleanSingleLine(text: string): boolean {
  const points = Array.from(text);
  if (points.length < 1 || points.length > LIMITS.maxPoints) return false;
  if (points.every((ch) => /\s/u.test(ch))) return false;
  return !points.some((ch) => /[\u0000-\u001f\u007f\uFEFF]/u.test(ch));
}

/**
 * 拒绝无法无损往返的 UTF-8，并阻止把非法文本悄悄写进输出。
 */
function validateEntry(text: string): string {
  if (!isCleanSingleLine(text)) {
    throw new Error("entry must be a clean UTF-8 single line of 1-140 code points");
  }
  const bytes = Buffer.from(text, "utf8");
  if (bytes.toString("utf8") !== text) {
    throw new Error("entry must survive a strict UTF-8 round trip");
  }
  return text;
}

function main(): void {
  const outputDir = resolveOutputDir(process.env["MAKEFUN_OUTPUT_DIR"]);
  const content = validateEntry(ENTRY);
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, "entry.txt"), Buffer.from(content, "utf8"));
}

main();
