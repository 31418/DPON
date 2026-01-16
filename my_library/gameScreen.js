class GameScreen extends AddRemoveUpdate {
  constructor(game, controls, gameOver, difficulty) {
    super();


  
    const level = new Level(game.w * 2, game.h * 2);
    const squizz = new Squizz(controls);
    squizz.pos = {
    x: (level.w / 2) | 0,
    y: (level.h / 2) | 0
    };
  
    const camera = this.add(
    new Camera(
      squizz,
      { w: game.w, h: game.h },
      { w: level.w, h: level.h },
    )
    );
    squizz.scoreAmount = 0;
    const score = new Text("Score: 0", {
    font: '20px Monaco',
    fill: '#50ffffff',
    })
    squizz.time = 0
    const timer = new Text("Time: 0", {
      font: '20px Monaco',
      fill: '#ff0000ff',
    });


    
    this.score = score;
    this.score.l = -50

    this.timer = timer;



    
  
    // Add roaming baddies
    this.baddies = this.addBaddies(level, difficulty);
    this.add(new Timer(100000, a => {squizz.time = a}));

    // Add it all to the game camera
    camera.add(level);
    camera.add(this.baddies);
    camera.add(squizz);
    camera.add(score);
    camera.add(timer);

  
    // Keep references to things we need in "update"
    this.level = level;
    this.camera = camera;
    this.squizz = squizz;
    this.squizz.lives = 30 / difficulty

    this.game = game

    this.game.speed = 1 / difficulty

    this.fx = this.add(new AddRemoveUpdate())

    this.par = this.fx.add(new ParticleMaker(10))

    this.triggers = this.add(new AddRemoveUpdate())

    const door = new Trigger({x: 32, y:32, w:32, h:32}, () => {
        console.log('Door triggered');
    });
    door.pos = {x: 32, y: 32};

    this.triggers.add(door)

  }
  
  addBaddies(level, difficulty) {
    const baddies = new AddRemoveUpdate();

    for (let i = 0; i < 3 * difficulty; i++) {
    const b = baddies.add(new Eater(rand(100, 300), 0));
    b.pos.y = ((level.h / rand(4, 6)) | 0) * i + level.tileH * 2;
    }
    // Vertical baddies
    for (let i = 0; i < 10; i++) {
    const b = baddies.add(new Eater(0, rand(100, 300)));
    b.pos.x = ((level.w / rand(9, 11)) | 0) * i + level.tileW;
    }
    return baddies;
  }
  
  update(dt, t) {
    super.update(dt, t);
    const { squizz, level } = this;

    hits(squizz, this.triggers, t => t.trigger())
  

    this.baddies.update(dt)

    this.updateBaddies();

    squizz.update(dt);

    squizz.alpha = 1;

    // Confine player to the level bounds
    const { pos } = squizz;
    const { bounds: { top, bottom, left, right } } = level;
    pos.x = clamp(pos.x, left, right);
    pos.y = clamp(pos.y, top, bottom);

    const mine = level.checkBombs(center(squizz), squizz.scoreAmount, squizz, this.camera, this.par);
    const coin = level.checkCoins(center(squizz), squizz, this, this.par)


  
    // See if we're on new ground
    const ground = level.checkGround(center(squizz));
    if (ground === "cleared") {
    squizz.lives -= 1
    this.camera.shake()
    
    }


    this.score.text = `Score: ${squizz.scoreAmount}, health: ${squizz.lives}`;
    this.score.l = -(6 + squizz.scoreAmount.toString().length) * 5;
    this.score.pos.x = squizz.pos.x - (32 - this.score.l)/2;
    this.score.pos.y = squizz.pos.y - 25;

    this.timer.text = squizz.time
    this.timer.l = -50;
    this.timer.pos = {x: -this.camera.pos.x + 30, y: -this.camera.pos.y + 30}


    
    

  }
  
  updateBaddies() {
    const { squizz, level } = this;
    
    this.baddies.map(b => {
    const { pos } = b;
    if (distanceEntity(squizz, b) < 32) {
      // A hit!
      squizz.lives -= 1
      this.camera.shake()
  

    }
  
    // Screen wrap
    if (pos.x > level.w) pos.x = -32;
    if (pos.y > level.h) pos.y = -32;
    });

    if (squizz.lives <= -100000){
      squizz.dead = true;
      gameOver(squizz.scoreAmount)
    }
  }
}