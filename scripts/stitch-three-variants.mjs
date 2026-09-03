import fs from 'node:fs/promises';
import path from 'node:path';
import { stitch } from '@google/stitch-sdk';

const runId = process.env.GITHUB_RUN_ID || String(Date.now());
const outDir = path.join('stitch-output', runId);
const read = async (p, fallback = '') => {
  try { return await fs.readFile(p, 'utf8'); } catch { return fallback; }
};

if (!process.env.STITCH_API_KEY) {
  throw new Error('STITCH_API_KEY is not configured. Add it as a GitHub Actions repository secret.');
}

const request = await read('.stitch/REQUEST.md');
const design = await read('DESIGN.md');
const source = await read('app/reviewer-intelligence/page.tsx');

const sourceContext = source.slice(0, 50000);
const prompt = `
You are designing a production-feasible UI for an existing Next.js application.

DESIGN REQUEST
${request}

SHARED DESIGN SYSTEM
${design}

CURRENT IMPLEMENTATION SOURCE
${sourceContext}

IMPORTANT:
- Preserve all required product behaviors and privacy language.
- Do not alter the public Chinaimo assessment design.
- Work only on the private 137 owner analytics experience.
- The final output must be realistic to implement with React/Next.js and ordinary CSS.
- Avoid generic AI-dashboard styling, cyberpunk tropes, excessive neon, gratuitous charts, and decorative clutter.
`;

await fs.mkdir(outDir, { recursive: true });

const project = await stitch.createProject(`Chinaimo 137 Owner Analytics - ${runId}`);
const base = await project.generate(prompt, undefined, 'GEMINI_3_PRO');
const variants = await base.variants(
  `Generate exactly three materially different production-ready alternatives. They should correspond conceptually to: (A) Executive Control Room, (B) Analytical Workbench, and (C) Spatial Intelligence. Differences must be meaningful in layout, information hierarchy, KPI treatment, session navigation, and journey visualization -- not merely color changes. Keep all three professional, restrained, accessible, and implementable.`,
  {
    variantCount: 3,
    creativeRange: 'EXPLORE',
    aspects: ['LAYOUT', 'COLOR_SCHEME', 'TEXT_FONT', 'TEXT_CONTENT'],
  },
  undefined,
  'GEMINI_3_PRO',
);

const manifest = {
  runId,
  generatedAt: new Date().toISOString(),
  projectId: project.id || project.projectId || null,
  requestPath: '.stitch/REQUEST.md',
  designPath: 'DESIGN.md',
  sourcePath: 'app/reviewer-intelligence/page.tsx',
  variantCount: variants.length,
  variants: [],
};

async function saveFromUrl(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await fs.writeFile(filePath, bytes);
}

for (let i = 0; i < variants.length; i += 1) {
  const variant = variants[i];
  const n = i + 1;
  const dir = path.join(outDir, `variant-${n}`);
  await fs.mkdir(dir, { recursive: true });

  const htmlUrl = await variant.getHtml();
  const imageUrl = await variant.getImage();
  await saveFromUrl(htmlUrl, path.join(dir, 'index.html'));
  await saveFromUrl(imageUrl, path.join(dir, 'screenshot.png'));

  manifest.variants.push({
    number: n,
    screenId: variant.id || null,
    html: `variant-${n}/index.html`,
    screenshot: `variant-${n}/screenshot.png`,
  });
}

await fs.writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
await fs.writeFile(
  path.join(outDir, 'REVIEW.md'),
  `# Stitch Variant Review\n\nRun: ${runId}\n\nLum review status: PENDING\n\n## Variant 1\n- Verdict: TBD\n- Strengths: TBD\n- Risks: TBD\n\n## Variant 2\n- Verdict: TBD\n- Strengths: TBD\n- Risks: TBD\n\n## Variant 3\n- Verdict: TBD\n- Strengths: TBD\n- Risks: TBD\n\n## Selected direction\nTBD -- no Stitch output is production-approved until Lum completes QA.\n`,
);

console.log(`Saved ${variants.length} Stitch variants to ${outDir}`);
