// Keep model and WASM requests on the website's own origin. npm's lockfile pins
// the runtime and model versions together; no CDN requests occur at runtime.
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
const require=createRequire(import.meta.url);
const source=dirname(require.resolve('@mediapipe/hands/package.json'));
const destination=new URL('../public/vendor/mediapipe/hands/',import.meta.url);
mkdirSync(destination,{recursive:true});
for(const file of readdirSync(source))copyFileSync(source+'/'+file,new URL(file,destination));
copyFileSync(new URL('../public/vendor/mediapipe/LICENSE',import.meta.url),new URL('LICENSE',destination));
