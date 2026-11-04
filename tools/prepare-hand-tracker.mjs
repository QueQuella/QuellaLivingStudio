// Browser requests stay on this website; download and verify versioned models
// only when preparing development, checks or a production build.
import {copyFileSync,mkdirSync,readdirSync,existsSync,readFileSync,writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const destination=new URL('../public/vendor/mediapipe/tfjs/',import.meta.url);
mkdirSync(destination,{recursive:true});
// Preserve the same MediaPipe Hands runtime used by the original standalone
// sketch. The TFJS/WASM runtime below remains a fallback for browsers where
// MediaPipe's video processing cannot initialize.
const handsDirectory=new URL('../public/vendor/mediapipe/hands/',import.meta.url);
mkdirSync(handsDirectory,{recursive:true});
const handsPackage=dirname(require.resolve('@mediapipe/hands/package.json'));
for(const file of readdirSync(handsPackage).filter(x=>/^(hands\.js|hands\.binarypb|hands_solution_.*\.(?:js|wasm|data)|hand_landmark_.*\.tflite|LICENSE)$/.test(x)))
  copyFileSync(join(handsPackage,file),new URL(file,handsDirectory));
await build({entryPoints:[fileURLToPath(new URL('hand-runtime.js',import.meta.url))],outfile:fileURLToPath(new URL('hand-runtime.mjs',destination)),bundle:true,format:'esm',platform:'browser',minify:true});
const wasm=dirname(require.resolve('@tensorflow/tfjs-backend-wasm'));
for(const file of readdirSync(wasm).filter(x=>x.endsWith('.wasm')))copyFileSync(join(wasm,file),new URL(file,destination));
copyFileSync(new URL('../public/vendor/mediapipe/LICENSE',import.meta.url),new URL('LICENSE',destination));
const hashes={
  'detector/model.json':'2de2e139e240169c9794c21676b8ca94da2bbc0146a3e0664133ce66e021b1a5',
  'detector/group1-shard1of1.bin':'8ba46d2152f48320cdb8835854f53d469dc6a33933099ff89929755ca1a88d51',
  'landmark/model.json':'2d6bd4d3b34a684e96293ff71e31f9fbc1b4922e0a88d82184cb584055ff3783',
  'landmark/group1-shard1of1.bin':'444bee1c7d6d330991bd3ce840a95d0c0afcc3a3fcec47c0c3b7f66a3f3533b0',
};
await Promise.all(Object.entries(hashes).map(async([path,hash])=>{
  const target=new URL(path,destination);
  mkdirSync(new URL('./',target),{recursive:true});
  let bytes;
  if(existsSync(target))bytes=readFileSync(target);
  else{
    const [kind,file]=path.split('/');
    const response=await fetch(`https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/${kind}/lite/1/${file}?tfjs-format=file`,{signal:AbortSignal.timeout(90000)});
    if(!response.ok)throw Error(`Hand model download failed: ${path} HTTP ${response.status}`);
    bytes=Buffer.from(await response.arrayBuffer());
  }
  if(createHash('sha256').update(bytes).digest('hex')!==hash)throw Error('Hand model checksum mismatch: '+path);
  if(!existsSync(target))writeFileSync(target,bytes);
}));
