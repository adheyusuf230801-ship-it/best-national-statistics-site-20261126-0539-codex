// Package the local static site and real browser captures with the unmodified kit library.
import { cpSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';
const here = fileURLToPath(new URL('.', import.meta.url));
const out = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
const sourceApp = join(here, 'app');
const sourceShots = join(here, 'screenshots');
if (!statSync(sourceApp).isDirectory() || !statSync(sourceShots).isDirectory()) {
  throw new Error('Expected local app/ and screenshots/ directories.');
}
mkdirSync(out, { recursive: true });
cpSync(sourceApp, join(out, 'app'), { recursive: true });
cpSync(sourceShots, join(out, 'screenshots'), { recursive: true });
writeFileSync(join(out, 'dossier.json'), buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
}));
