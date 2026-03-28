# AGENTS.md - EndOf10Days 项目指南

## 项目概述

`EndOf10Days` 是一个基于 React + Vite 的《十日终焉》主题资料与展陈前端项目，目标是把人物、事件、世界观与关系内容组织成可浏览、可跳转、可回看的沉浸式站点。

技术栈：
- Node.js 20+
- React 19
- Vite
- TypeScript
- Vitest

## 仓库结构

```text
EndOf10Days/
├── src/                     # 前端应用、测试与样式
├── docs/                    # 清单、计划、问题记录
├── memory/                  # 工程记忆、事故与模板
├── scripts/                 # 仓库级检查脚本
├── .github/workflows/       # CI / 手动测试 / Issue 工作流
└── demo/                    # 参考样式与旧原型
```

## 开发优先级

开发时按以下顺序理解上下文：
1. `docs/plans/*.md`
2. `docs/AGENTS.md`
3. `AGENTS.md`
4. `memory/*.md`
5. 仓库现有代码与测试

## 基础命令

```bash
npm ci
npm run lint
npm test
npm run build
./scripts/run_checks.sh
```

## 核心约束

### 1. 开始前先看仓库状态

开始分析或改动前，先执行：

```bash
git status --short --branch
```

如果显示 `HEAD detached`，先确认当前提交归属分支，再继续判断仓库状态。

### 2. 先看规范，再看实现

涉及范围、流程、交付标准时，优先参考：
- `docs/plans/*.md`
- `docs/AGENTS.md`
- `memory/MEMORY.md`

### 3. 错误必须进入记忆，而不是只修当前点

每次出现真实错误时，必须做三件事：
1. 在 `memory/incidents.md` 记录错误现象、根因、漏掉的检查项
2. 在 `memory/MEMORY.md` 补一条长期规则或更新已有规则
3. 补一条自动化防线：测试、脚本检查或 CI 校验

### 4. 资料分层必须清楚

研究池、清单层、正式层和记忆层必须分开处理。正式页面只消费正式层或明确标记为 `待核` 的过渡数据，具体分层规则以 `docs/content-layering.md` 为准。

只写文档、不补防线，视为未完成闭环。

### 5. 统一验证入口

仓库级交付前至少运行：

```bash
./scripts/run_checks.sh
```

它负责：
- 检查关键治理文件是否存在
- 检查本地是否处于 detached HEAD
- 运行 `npm run lint`
- 运行 `npm test`
- 运行 `npm run build`

## 测试策略

- 前端测试：`src/*.test.tsx`、`src/*.test.ts`
- 仓库治理回归测试：`src/clean-list-sync.test.ts`
- 需要新增规则、流程或关键脚本时，优先补治理测试，避免规范再次失效

## 错误记忆流程

使用 `memory/templates.md` 中的模板记录错误，推荐流程：

1. 记录错误现象
2. 归纳根因
3. 写出本该提前执行的检查
4. 写出新增防线
5. 如果是高频问题，升级到 `memory/MEMORY.md`

## 典型高风险点

- 资料内容同步：`docs/`、`src/archiveData.ts`、页面展示必须一致
- 人物馆画布：卡片边界、相机、缩放、拖拽必须通过测试验证
- 事件馆时间轴：阶段顺序和事件锚点不能乱序
- 世界观馆结构：分类口径要稳定，不能随意改名导致断链
- 构建产物：`dist/` 不应进入版本控制
- 本地缓存：`node_modules/`、`*.tsbuildinfo`、`.DS_Store` 必须忽略

## 交付前检查

- 是否阅读了当前阶段计划
- 是否有对应测试覆盖
- 是否运行了 `./scripts/run_checks.sh`
- 是否把本次错误或新增规则写入了 `memory/`
