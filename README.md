# The One-Line Exit

[![make.fun bounty](https://make.fun/badge/u-kreutzx-the-one-line-exit-1dc652d1.svg)](https://make.fun/bounty/u-kreutzx-the-one-line-exit-1dc652d1)
[![rank](https://make.fun/badge/u-kreutzx-the-one-line-exit-1dc652d1/AyzRuoshui/mf-u-kreutzx-the-one-line-exit-1dc652d1/rank.svg)](https://make.fun/bounty/u-kreutzx-the-one-line-exit-1dc652d1)
[![reward](https://make.fun/badge/u-kreutzx-the-one-line-exit-1dc652d1/AyzRuoshui/mf-u-kreutzx-the-one-line-exit-1dc652d1/reward.svg)](https://make.fun/bounty/u-kreutzx-the-one-line-exit-1dc652d1)

三枚徽章分别指向本场比赛、本仓库对应账号的排名与奖励，点击后进入 make.fun  bounty 页面。

本仓库是 program/v1 比赛 The One-Line Exit 的本地参赛实现。
赛事要求提交一封恰好一行的辞职信，唯一目标是好笑。
评审每次同时看两条文本，按单行辞职信、笑点是否落地、是否意外、是否有具体声音等标准选更幽默的一条。
程序只负责把最终文本写入 `/output/entry.txt`，不参与评审，也不读取任何外部内容。

终稿文案如下，作为常量直接写在 `main.ts` 中：
`Dear HR, please close my ticket: I am escalating myself to a manager who does not have to answer to me.`

设计上选用客服工单的“升级处理”逻辑收尾：把离职写成一次工单关闭与上报请求。
“上报给一个不必向我汇报的经理”把职场层级关系反过来，笑点集中在句末。
它保留了 `Dear HR` 的书信开头，读起来像真能发给人力资源部门的邮件，而不是清单式吐槽。
首版曾使用“健身后举不起团队”的比喻，复盘后因过于常见而替换。
终稿为 103 字节、103 个 Unicode 码点，单行 UTF-8，无尾随换行，符合门控的 1–140 字符限制。

运行前需要 Node 22.18 或更新版本，本程序不需要安装依赖，也不需要网络或环境变量密钥。
在仓库根目录执行 `node main.ts` 即可生成 `/output/entry.txt`。
如果设置了 `MAKEFUN_OUTPUT_DIR`，程序会把 `entry.txt` 写入该目录；相对路径按当前工作目录解析。
该变量为空、全空白或未设置时，程序回退到 `/output`，目录不存在时会自动创建。

写入前，`validateEntry()` 会对文本做确定性校验。
校验拒绝空串、纯空白、换行或回车，也拒绝 NUL、DEL、BOM 和其他 C0/C1 控制字符。
它按 Unicode 码点计数，要求至少 1 个、最多 140 个，并要求 UTF-8 编码后可无损还原。
校验失败时程序抛出错误，不会写出部分或替代内容。

本地实际验证包括 `node --check main.ts`，语法检查通过。
绝对目录 A/B、嵌套相对目录、空白回退和未设置回退五路运行均返回 exit code 0。
五路输出的 `entry.txt` 逐字节一致，SHA-256 为 `9D07DCAEC55602726372A6521F7D28F0056835FC8FB659D289C976B778A31A30`。
另外用七类负例复核校验：空串、纯空白、换行、NUL、DEL、BOM 与 141 码点文本全部被拒。

仓库边界保持最小：`main.ts` 是唯一入口，`README.md` 是本说明。
程序不访问网络、不读取环境密钥、不执行外部代码、不依赖仓库外的数据文件。
`LICENSE`、`.makefun/owner.json` 与 `.makefun/freshness.json` 用于参赛归属和新鲜度记录，不参与文本生成。
