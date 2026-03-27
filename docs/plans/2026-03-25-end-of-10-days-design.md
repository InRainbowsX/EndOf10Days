# End Of 10 Days Interactive Archive Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a first-release immersive single-page website that lets readers who finished the novel explore the first-room core cast through a dramatic boot sequence, an interactive relationship graph, a character dossier, and a supporting timeline.

**Architecture:** Use a Vite + React + TypeScript single-page app with static content data stored in local modules. The app boots into a short “system wake-up” state, then renders a graph-centric layout where state changes drive synchronized updates across the graph, dossier, and timeline. Tests cover the core interaction contract so the UI can evolve without losing the intended experience.

**Tech Stack:** Vite, React, TypeScript, CSS modules or plain CSS, Vitest, Testing Library

### Task 1: Scaffold the app shell

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Test: `src/app-shell.test.tsx`

**Step 1: Write the failing test**

```tsx
it('renders the archive shell heading after boot', async () => {
  render(<App />);
  expect(screen.getByText(/正在接入终焉档案/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /跳过接入/ }));
  expect(await screen.findByText(/终焉回溯系统/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app-shell.test.tsx`
Expected: FAIL because the app and tooling are not created yet

**Step 3: Write minimal implementation**

Create the Vite React app shell, test config, and a minimal `App` component that can transition from boot view to archive shell.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app-shell.test.tsx`
Expected: PASS

### Task 2: Lock the graph interaction contract with tests

**Files:**
- Create: `src/archiveData.ts`
- Create: `src/components/BootSequence.tsx`
- Create: `src/components/RelationshipGraph.tsx`
- Create: `src/components/CharacterDossier.tsx`
- Create: `src/components/TimelineRail.tsx`
- Test: `src/archive-interactions.test.tsx`

**Step 1: Write the failing test**

```tsx
it('updates dossier and timeline when a character node is selected', async () => {
  render(<App initialBootComplete />);
  await userEvent.click(screen.getByRole('button', { name: /齐夏/ }));
  expect(screen.getByRole('heading', { name: /齐夏/ })).toBeInTheDocument();
  expect(screen.getByText(/欺诈与推演/)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: /起始赌局/ }));
  expect(screen.getByText(/第一间房的共犯结构开始成形/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/archive-interactions.test.tsx`
Expected: FAIL because graph, dossier, and timeline interactions do not exist yet

**Step 3: Write minimal implementation**

Add local archive data, node selection state, and synchronized rendering across graph, dossier, and timeline.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/archive-interactions.test.tsx`
Expected: PASS

### Task 3: Build the immersive visual system

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Test: `src/archive-visuals.test.tsx`

**Step 1: Write the failing test**

```tsx
it('renders immersion controls and reduced-motion-safe status labels', async () => {
  render(<App initialBootComplete />);
  expect(screen.getByRole('button', { name: /关系全览/ })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /时间聚焦/ })).toBeInTheDocument();
  expect(screen.getByText(/低功耗节点/)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/archive-visuals.test.tsx`
Expected: FAIL because the immersion controls and labels are not implemented yet

**Step 3: Write minimal implementation**

Implement the final layout, controls, semantic labels, and atmospheric styling with accessible focus states and reduced-motion handling.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/archive-visuals.test.tsx`
Expected: PASS

### Task 4: Verify the release build

**Files:**
- Modify: `package.json`

**Step 1: Run the focused tests**

Run: `npm test`
Expected: PASS

**Step 2: Run the production build**

Run: `npm run build`
Expected: PASS with generated `dist/`

**Step 3: Preview sanity check**

Run: `npm run dev -- --host 0.0.0.0`
Expected: Local preview launches without runtime errors
