# EndOf10Days CI / Governance Sync Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 `EndOf10Days` 按参考仓库的方式补齐治理文件、记忆、Docker 与 CI 工作流，并保持前端项目可独立验证、可提交、可回归。

**Architecture:** 这是一个纯前端 Vite/React 仓库，因此治理结构沿用参考仓库的“AGENTS + memory + scripts + GitHub Actions”模式，但裁剪掉后端相关目录。CI 以 `npm test` 和 `npm run build` 为主，辅以仓库治理检查；Docker 只保留适合前端预览与测试的镜像/编排，避免引入无关后端复杂度。

**Tech Stack:** GitHub Actions, Docker, docker-compose, Node.js 20, Vite, Vitest, TypeScript.

### Task 1: 补齐治理文件与工程记忆

**Files:**
- Create: `AGENTS.md`
- Create: `docs/AGENTS.md`
- Create: `memory/MEMORY.md`
- Create: `memory/incidents.md`
- Create: `memory/templates.md`
- Create: `memory/development.md`
- Modify: `.gitignore`

**Step 1: 写出治理文件**
参考 `cadet-workspace` 的职责分层，写成中文主导版本，强调：
- 先看 `AGENTS.md` / `docs/AGENTS.md` / `memory/`
- 开始前先看 `git status --short --branch`
- 错误要进入 `memory/incidents.md`
- 仓库级交付前要跑统一检查
- 仅保留本项目需要的前端规则

**Step 2: 写出工程记忆**
在 `memory/MEMORY.md` 里记录长期规则：
- 先研究再改
- 问题先入 memory 再闭环
- CI 至少覆盖 test 与 build
- 对 `node_modules/`、`dist/`、`*.tsbuildinfo` 进行忽略

**Step 3: 更新忽略列表**
确保 `.gitignore` 覆盖前端构建产物和本地缓存。

### Task 2: 补齐 Docker 与本地一致性检查

**Files:**
- Create: `Dockerfile`
- Create: `docker-compose.yml`
- Create: `docker-compose.test.yml`
- Create: `scripts/run_checks.sh`

**Step 1: 设计最小 Docker**
为前端仓库提供：
- 生产预览镜像
- 测试镜像
- docker-compose 测试编排

**Step 2: 设计统一检查脚本**
脚本应顺序执行：
- 检查治理文件存在
- `npm test`
- `npm run build`

**Step 3: 保持脚本可在 CI 与本地复用**
避免把逻辑写死在 workflow 里。

### Task 3: 补齐 GitHub Actions 工作流

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/test.yml`
- Create: `.github/workflows/issue-workflow.yml`

**Step 1: CI**
加入：
- PR 规范检查
- 代码检查
- 测试
- 仓库治理检查

**Step 2: 手动测试**
支持 workflow_dispatch，便于只跑 test / build。

**Step 3: Issue 工作流**
Issue 创建或评论时发出统一评论，给出：
- 建议流程
- 测试要求
- 分支 / PR 规范

### Task 4: 验证与提交

**Files:**
- Modify: `package.json`（如需要补 `lint` / `check` 脚本）

**Step 1: 本地验证**
运行：
- `npm test`
- `npm run build`
- `./scripts/run_checks.sh`

**Step 2: Git 操作**
确认变更范围后提交并推送到 `main`。

