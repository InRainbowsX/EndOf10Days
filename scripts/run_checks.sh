#!/usr/bin/env bash
set -euo pipefail

required_files=(
  "AGENTS.md"
  "docs/AGENTS.md"
  "memory/MEMORY.md"
  "memory/incidents.md"
  "memory/templates.md"
  "memory/development.md"
  "Dockerfile"
  "docker-compose.yml"
  "docker-compose.test.yml"
  ".github/workflows/ci.yml"
  ".github/workflows/test.yml"
  ".github/workflows/issue-workflow.yml"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || { echo "缺少治理文件: $file"; exit 1; }
done

if git status --short --branch | head -n 1 | grep -q "HEAD detached"; then
  echo "当前处于 detached HEAD"
  exit 1
fi

npm run lint
npm test
npm run build

