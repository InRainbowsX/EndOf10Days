# End Of 10 Days Network Exploration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Upgrade the current cast-focused archive into a unified exploration network that links characters, events, rules, factions, and truth nodes across the novel.

**Architecture:** Replace the current character-only graph data with a unified node-and-edge model. The main view renders a multi-type exploration network, while the side dossier and bottom timeline read from the currently selected node and its linked neighborhood. A lightweight trail state preserves the user’s exploration path so the interface feels like investigation rather than tab switching.

**Tech Stack:** Vite, React, TypeScript, CSS, Vitest, Testing Library

### Task 1: Lock the unified network contract with tests

**Files:**
- Create: `src/network-exploration.test.tsx`
- Modify: `src/archive-interactions.test.tsx`
- Modify: `src/App.tsx`

**Step 1: Write the failing test**

```tsx
it('lets users jump from a character to a linked event and records the exploration trail', async () => {
  render(<App initialBootComplete />);
  await userEvent.click(screen.getByRole('button', { name: /终焉之地/ }));
  expect(screen.getByRole('heading', { name: /终焉之地/ })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /第一间房试炼/ }));
  expect(screen.getByText(/探索轨迹/)).toBeInTheDocument();
  expect(screen.getByText(/终焉之地/)).toBeInTheDocument();
  expect(screen.getByText(/第一间房试炼/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/network-exploration.test.tsx`
Expected: FAIL because multi-type nodes and trail UI do not exist yet

**Step 3: Write minimal implementation**

Add a unified node selection flow that supports non-character nodes and records trail items.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/network-exploration.test.tsx`
Expected: PASS

### Task 2: Refactor archive data into nodes and edges

**Files:**
- Modify: `src/archiveData.ts`
- Create: `src/archiveGraph.ts`

**Step 1: Write the failing test**

```tsx
it('shows linked nodes with semantic labels for the selected node', async () => {
  render(<App initialBootComplete />);
  expect(screen.getByText(/触发/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/network-exploration.test.tsx`
Expected: FAIL because semantic link data is not rendered

**Step 3: Write minimal implementation**

Create a node catalog and semantic edges for characters, events, rules, factions, and truth concepts.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/network-exploration.test.tsx`
Expected: PASS

### Task 3: Upgrade the UI to a large exploration network

**Files:**
- Modify: `src/components/RelationshipGraph.tsx`
- Modify: `src/components/CharacterDossier.tsx`
- Modify: `src/components/TimelineRail.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `src/archive-visuals.test.tsx`

**Step 1: Write the failing test**

```tsx
it('renders node filters and node-type aware dossier sections', async () => {
  render(<App initialBootComplete />);
  expect(screen.getByRole('button', { name: /只看事件/ })).toBeInTheDocument();
  expect(screen.getByText(/关联节点/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/archive-visuals.test.tsx`
Expected: FAIL because filter controls and upgraded dossier sections are not implemented

**Step 3: Write minimal implementation**

Implement node-type chips, semantic connection panels, and trail-aware styling while preserving responsive clarity.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/archive-visuals.test.tsx`
Expected: PASS

### Task 4: Verify the expanded release

**Files:**
- Modify: `package.json`

**Step 1: Run all tests**

Run: `npm test`
Expected: PASS

**Step 2: Run production build**

Run: `npm run build`
Expected: PASS

**Step 3: Run local preview**

Run: `npm run dev -- --host 0.0.0.0`
Expected: Local preview launches without runtime errors
