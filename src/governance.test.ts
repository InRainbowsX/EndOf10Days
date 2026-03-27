import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const requiredFiles = [
  'AGENTS.md',
  'docs/AGENTS.md',
  'memory/MEMORY.md',
  'memory/incidents.md',
  'memory/templates.md',
  'memory/development.md',
  'Dockerfile',
  'docker-compose.yml',
  'docker-compose.test.yml',
  '.github/workflows/ci.yml',
  '.github/workflows/test.yml',
  '.github/workflows/issue-workflow.yml',
  'scripts/run_checks.sh',
];

describe('repository governance', () => {
  it('keeps the required governance files in place', () => {
    for (const file of requiredFiles) {
      expect(fs.existsSync(path.join(repoRoot, file))).toBe(true);
    }
  });
});
