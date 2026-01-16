const enemyTexture = new Texture('sdtwo/images/gaurd.png');
class Ghost extends TileSprite {
  constructor(target, map, ghosts, pos) {
    console.log('ghost made')
    super(enemyTexture, 32, 32);
    this.hitBox = {
      x: 8,
      y: 8,
      w: 32,
      h: 32
    };
    this.speed = 100;
    this.target = target;
    this.waypoint = null;
    this.map = map;
    this.pivot = { x: 16, y: 16 };  

    this.path = [];
    this.ghosts = ghosts
    if (this.pos){
      this.pos = pos
      console.log('ghost pos exists already' + this.pos.x + ',' + this.pos.y)
    }
    else{
      this.pos = map.findFreeSpot()
    }

    this.health = 20



  }

findPath() {
    // Calculate the path-finding path
    const { map, target } = this;

    const s = map.pixelToMapPos(center(this));
    const d = map.pixelToMapPos(center(this.target));
    map.path.findPath(s.x, s.y, d.x ,d.y, p => {
      this.path = p || [];
    });
    map.path.calculate();

    
  }




  followPath(dt) {
    const { map, speed, path, pos, hitBox } = this;
    // Move along the path
    if (!path.length) {
      return;
    }


    const cell = this.path[0];
    // Move in the direction of the path
    const xo = cell.x * map.tileW - (pos.x - hitBox.x);
    const yo = cell.y * map.tileH - (pos.y - hitBox.y);

    const closeX = Math.abs(xo) <= 2;
    const closeY = Math.abs(yo) <= 2;
    if (!closeX) this.pos.x += Math.sign(xo) * speed * dt;
    if (!closeY) this.pos.y += Math.sign(yo) * speed * dt;

    // If you made it, move to the next path element
    if (closeX && closeY) {
      console.log('ghost close to a waypoint')
      this.path = this.path.slice(1);
    }


  }


  update(dt, t) {
    const { pos } = this;

    this.followPath(dt);

    if (t % 0.5 < dt && !this.path.length && distance(center(this), center(this.target)) < 200) {
      this.findPath();
    }

    //calculate dir of player
    if (distance(center(this), center(this.target)) < 200){
          const dx = this.target.pos.x - this.pos.x
    const dy = this.target.pos.y - this.pos.y
    const angle = Math.atan2(dy, dx)
    this.rotation = angle + Math.PI / 2
      if (distance(center(this), center(this.target)) < 30){
        
      }
    }
    
    




    
    
  }
}