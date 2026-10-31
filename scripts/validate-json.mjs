// Fails the build on a JSON syntax error in src/data/.
// (Astro's file() loader only logs parse errors; schema errors are caught by zod.)
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'src/data';
let failed = false;
for (const name of readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  try {
    JSON.parse(readFileSync(join(dir, name), 'utf8'));
  } catch (err) {
    console.error(`✖ ${dir}/${name}: ${err.message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('✔ src/data JSON is well-formed');
