# Event Hall Chronology Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand the Event Hall into a fuller, immersive, chronological timeline with dense, causal event content and character links.

**Architecture:** Keep the existing timeline-first structure in `DoomRiver.tsx`, expand `archiveData.ts` event nodes and edges for richer chronological coverage and character links, and enforce requirements with tests in `event-timeline.test.tsx`.

**Tech Stack:** React + TypeScript (Vite), Vitest, Testing Library.

### Task 1: Add failing tests for event completeness

**Files:**
- Modify: `src/event-timeline.test.tsx`

**Step 1: Write the failing tests**

```ts
it('links every event to at least one character', () => {
  const eventNodes = archiveNodes.filter((node) => node.type === 'event');
  const characterIds = new Set(archiveNodes.filter((node) => node.type === 'character').map((node) => node.id));
  eventNodes.forEach((event) => {
    const hasCharacterLink = archiveEdges.some((edge) => {
      return (
        (edge.source === event.id && characterIds.has(edge.target)) ||
        (edge.target === event.id && characterIds.has(edge.source))
      );
    });
    expect(hasCharacterLink).toBe(true);
  });
});

it('ensures each event surfaces a causal section (后果/结果/意义)', () => {
  const eventNodes = archiveNodes.filter((node) => node.type === 'event');
  eventNodes.forEach((event) => {
    const hasCausalSection = event.sections.some((section) => ['后果', '结果', '意义'].includes(section.label));
    expect(hasCausalSection).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npx vitest run src/event-timeline.test.tsx`
Expected: FAIL due to missing character links or causal sections.

### Task 2: Expand event nodes and add character links

**Files:**
- Modify: `src/archiveData.ts`

**Step 1: Add new event nodes**

Add additional event nodes based on `docs/2026-03-26-structured-events-table.md` to increase density per phase:
```
- 空屋苏醒（细分：秩序冲突/说谎筛人）
- 首轮死亡与循环确认（细分：死亡确认/记忆断裂）
- 概率型早期训练场（细分：人鼠、人猪）
- 道德与生存切换
- 主角团雏形形成（细分：分工稳定/临时共谋）
- 信息差与规则缝隙
- 回响第一次外化
- 生肖游戏总体系
- 高压问答局群（地鸡/地蛇/人蛇）
- 极乐钱庄与收益模型
- 天堂口与组织化生存
- 白羊身份跃迁
- 龙类与神兽压迫
- 青龙失势与双龙裂痕
- 列车与第二站
- 天龙离析与全域清场
- 终局重写胜利条件
- 生生不息复活悖论
- 终局价值观落点
- 未完成回收与重置解释
- 齐夏变量与神性问题
- 前史布局与长线预设
```

Ensure each event includes sections with at least one `后果`/`结果`/`意义` label.

**Step 2: Add archiveEdges for character links**

For each new event, add at least one edge linking to a relevant character ID (e.g., `qixia`, `linqin`, `qiaojiajin`, `chenjunnan`, `chutianqiu`, `yanzhichun`, `baiyang`, `qinglong`, `tianlong`, `xuliunian`, `renyang`, `renshe`, `dishe`, `renzhu`).

**Step 3: Run test to verify it passes**

Run: `npx vitest run src/event-timeline.test.tsx`
Expected: PASS.

### Task 3: Full test sweep

**Files:**
- No changes

**Step 1: Run full test suite**

Run: `npm test`
Expected: PASS.

**Step 2: Run build**

Run: `npm run build`
Expected: PASS.

**Step 3: Commit**

```bash
git add src/event-timeline.test.tsx src/archiveData.ts docs/plans/2026-03-27-event-hall-chronology-plan.md
git commit -m "feat: expand event hall chronology content and links"
```

