// Solmar Bay, an original open-world crime game. This entry hands in the static game and its
// real gameplay screenshots; make.fun's vendored library builds the dossier used by the judge.
// Run locally with `node serve.ts` and open http://localhost:8080.
import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const shots = join(here, 'screenshots');
if (!existsSync(shots) || readdirSync(shots).filter(name => /\.(?:jpg|jpeg|png)$/i.test(name)).length === 0) {
  throw new Error('Solmar Bay needs at least one screenshot in screenshots/ before it can be submitted.');
}
mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shots, join(out, 'screenshots'), { recursive: true });
writeFileSync(join(out, 'dossier.json'), buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
}));
