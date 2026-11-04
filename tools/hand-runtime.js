import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';
import '@tensorflow/tfjs-backend-cpu';
import {load} from '@tensorflow-models/hand-pose-detection/dist/tfjs/detector.js';
// This runtime does not register the WebGL backend. All pixels and inference
// stay on the CPU, including browsers without a working graphics context.
export async function createDetector(base){
  setWasmPaths(base);
  tf.env().set('WASM_HAS_MULTITHREAD_SUPPORT',false);
  try{if(!await tf.setBackend('wasm'))throw Error('WASM unavailable');}
  catch{await tf.setBackend('cpu');}
  await tf.ready();
  const detector=await load({runtime:'tfjs',modelType:'lite',maxHands:1,
    detectorModelUrl:base+'detector/model.json',landmarkModelUrl:base+'landmark/model.json'});
  return {
    async detectForVideo(input){
      const hands=await detector.estimateHands(input,{flipHorizontal:false,staticImageMode:false});
      const w=input.videoWidth||input.naturalWidth||input.width;
      const h=input.videoHeight||input.naturalHeight||input.height;
      return {landmarks:hands.map(hand=>hand.keypoints.map(p=>({x:p.x/w,y:p.y/h,z:(p.z||0)/w}))) };
    },
    close(){detector.dispose();},
  };
}
