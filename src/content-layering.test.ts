import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Content layering documentation', () => {
  it('describes the four content layers in a dedicated doc', () => {
    const docPath = resolve(process.cwd(), 'docs/content-layering.md');
    const doc = readFileSync(docPath, 'utf8');

    expect(doc).toContain('研究池');
    expect(doc).toContain('清单层');
    expect(doc).toContain('正式层');
    expect(doc).toContain('记忆层');
    expect(doc).toContain('晋升路径');
  });
});
