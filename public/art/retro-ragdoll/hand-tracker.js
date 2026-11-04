/* Camera lifecycle is independent of the p5/WebGL renderer. */
(() => {
  const assets=new URL('../../vendor/mediapipe/tfjs/',document.currentScript.src).href;
  async function createDetector(){
    const runtime=await import(assets+'hand-runtime.mjs');
    return runtime.createDetector(assets);
  }
  class RetroCameraController{
    constructor({video,onState,onStatus,onResults,makeDetector=createDetector,getStream=()=>{if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera access requires HTTPS and a supported browser.');return navigator.mediaDevices.getUserMedia({audio:false,video:{width:{ideal:640},height:{ideal:480},facingMode:'user'}});}}){
      Object.assign(this,{video,onState,onStatus,onResults,makeDetector,getStream});
      this.state='stopped';this.generation=0;this.stream=null;this.detector=null;this.frame=0;
    }
    setState(state){this.state=state;this.onState(state);}
    toggle(){return this.state==='stopped'?this.start():this.stop();}
    async start(){
      if(this.state!=='stopped')return;
      const generation=++this.generation;
      this.setState('starting');this.onStatus('REQUESTING CAMERA · STOP TO CANCEL');
      try{
        const stream=await this.getStream();
        if(generation!==this.generation){stream.getTracks().forEach(t=>t.stop());return;}
        this.stream=stream;
        for(const track of stream.getTracks())track.addEventListener?.('ended',()=>{if(generation===this.generation)this.stop();});
        this.video.srcObject=stream;
        await this.video.play();
        if(generation!==this.generation)return;
        this.onStatus('LOADING HAND TRACKER · STOP TO CANCEL');
        let timer;
        const loading=Promise.resolve().then(()=>this.makeDetector());
        // Close late initialization results after cancellation or a timeout.
        loading.then(detector=>{if(generation!==this.generation)detector.close();},()=>{});
        let detector;
        try{detector=await Promise.race([loading,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Hand tracker loading timed out. Press START to retry.')),30000);})]);}
        finally{clearTimeout(timer);}
        if(generation!==this.generation)return;
        this.detector=detector;this.lastVideoTime=-1;this.lastInference=-Infinity;
        this.setState('running');this.onStatus('CAMERA ACTIVE · SHOW YOUR PALM');
        this.frame=requestAnimationFrame(t=>this.process(t,generation));
      }catch(error){
        if(generation!==this.generation)return;
        this.stop();
        const detail=error.name==='NotAllowedError'?'Allow camera access for this website, then press START.'
          :error.name==='NotFoundError'?'No camera found. Connect a camera, then press START.'
          :error.name==='NotReadableError'?'Camera is in use by another app. Close it and press START.'
          :error.message;
        this.onStatus('HAND TRACKING ERROR · '+detail);
        console.error('Hand tracker:',error);
      }
    }
    async process(now,generation){
      if(generation!==this.generation||this.state!=='running')return;
      try{
        if(this.video.readyState>=2&&this.video.videoWidth>0&&this.video.currentTime!==this.lastVideoTime&&now-this.lastInference>=50){
          this.lastVideoTime=this.video.currentTime;this.lastInference=now;
          this.inFlight=Promise.resolve(this.detector.detectForVideo(this.video,now));
          const result=await this.inFlight;
          if(generation===this.generation){
            this.onResults(result);
            this.onStatus(result.landmarks?.length?'HAND DETECTED · PALM: MOVE / MIDDLE FINGER: TILT':'CAMERA ACTIVE · SEARCHING FOR HAND');
          }
        }
      }catch(error){this.stop();this.onStatus('HAND TRACKING ERROR · '+error.message);console.error(error);return;}
      if(generation===this.generation&&this.state==='running')this.frame=requestAnimationFrame(t=>this.process(t,generation));
    }
    stop(){
      ++this.generation;cancelAnimationFrame(this.frame);this.frame=0;
      this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;
      this.video.pause();this.video.srcObject=null;
      const detector=this.detector;this.detector=null;
      if(detector){
        if(this.inFlight)Promise.resolve(this.inFlight).catch(()=>{}).finally(()=>detector.close());
        else detector.close();
      }
      this.inFlight=null;
      this.setState('stopped');this.onResults({landmarks:[]});
      this.onStatus('STOPPED · PRESS START TO RESUME');
    }
  }
  window.RetroCameraController=RetroCameraController;
})();
