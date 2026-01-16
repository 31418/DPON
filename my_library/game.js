const STEP = 1 / 60;
let MULTIPLIER = 1;
let SPEED = STEP * MULTIPLIER;
const MAX_FRAME = SPEED * 5;

class Game {
  constructor(w, h, parent = "#board") {
    this.w = w;
    this.h = h;
    this.renderer = new CanvasRenderer(w, h);
    document.querySelector(parent).appendChild(this.renderer.view);
    this.scene = new AddRemoveUpdate();
  }

  run(gameUpdate = () => {}) {
    Assests.onReady(() => {
      let dt = 0;
      let last = 0;

      const loopy = ms => {
        requestAnimationFrame(loopy);

        const t = ms / 1000; // seconds
        dt += Math.min(t - last, MAX_FRAME);
        last = t;

        while (dt >= SPEED) {
          this.scene.update(STEP, t / MULTIPLIER);
          gameUpdate(STEP, t / MULTIPLIER);
          dt -= SPEED;
        }

        this.renderer.render(this.scene);
      };

      requestAnimationFrame(loopy);
    });
  }
  get speed(){
    return SPEED
  }
  set speed(speed){
    MULTIPLIER = speed
    SPEED = STEP * MULTIPLIER
  }
}

class Timer {
  constructor(length = 5.0, onTick, onDone = null, delay = 0){
    this.length = length;
    this.onTick = onTick;
    this.elapsed = 0; 
    this.dead = false
    this.visible = false
    
    this.onDone = onDone
    this.delay = delay;
  }
  update(dt){
    if (this.delay > 0){
      this.delay -= dt;
      return;
    }
    this.elapsed += dt;
    if(this.elapsed >= this.length){
      if (this.onDone !== null){
        this.onDone();
         console.log('done');
      }
      this.dead = true
    }
    else{
      this.onTick(this.elapsed);
    }
  }
}