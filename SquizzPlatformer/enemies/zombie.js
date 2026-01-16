class Zombie extends TileSprite {
  constructor(texture, map, player, pos, game) {
    super(texture, 32, 32);

    this.map = map;
    this.player = player;
    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.game = game;

    this.jumping = true;
    this.jump = false;

    this.speed = 40;

    this.vel = new Vector();
    this.acc = new Vector();

    this.hitBox = {
      x: 8,
      y: 8,
      w: 24,
      h: 24,
    };

    this.falling = false;
    this.facing = "left";
    this.knockbackAmount = 0;

    //attacking
    this.attackDamage = rand(30, 35);
    this.attackCooldown = 1.2;
    this.attackTimer = 0;

    this.health = 100;

    //anims
    this.anims = new AnimManager(this);
  }
  attackPlayer(dt) {
    this.attackTimer -= dt;
    if (this.attackTimer < 0) {
      this.player.takeDamage(this.attackDamage);
      this.attackTimer = this.attackCooldown;
    }
  }
  takeDamage(damage, ranged = false) {
    if (distanceEntity(this, this.player) < 40 || ranged) {
      this.health -= damage;

      this.game.playParticles("damage", this.pos);

      if (this.health <= 0) {
        this.dead = true;
        this.player.xp += 3;
      }
    }
  }
  takeKnockback(amount) {
    this.knockbackAmount = amount;
  }
  update(dt, t) {
    super.update(dt, t);

    //visuals
    if (this.facing === "right") {
      this.frame.x = 0;
    } else {
      this.frame.x = 1;
    }

    if (this.knockbackAmount !== 0) {
      if (distanceEntity(this, this.player) < 40) {
        if (this.pos.x > this.player.pos.x) {
          applyImpulse(this, { x: this.knockbackAmount, y: -50 }, dt);
        } else {
          applyImpulse(this, { x: -1 * this.knockbackAmount, y: -50 }, dt);
        }
      }
      this.knockbackAmount = 0;
    }

    if (this.jump) {
      applyImpulse(this, { x: 0, y: -30 }, dt);
      this.jump = false;
    }

    if (this.falling) {
      this.vel.y += 100 * dt;
    } else {
      this.vel.y = 0;
    }
    const blockLeft = this.map.tileAtPixelPos({
      x: this.pos.x - 19,
      y: this.pos.y + 33,
    });
    const blockRight = this.map.tileAtPixelPos({
      x: this.pos.x + 19,
      y: this.pos.y + 33,
    });
    if (distance(this.pos, this.player.pos) < 600) {
      if (this.player.pos.x > this.pos.x && blockRight.frame.id !== "floor") {
        if (this.vel.x < 80) applyForce(this, { x: this.speed / 6, y: 0 });
        this.facing = "right";
      } else if (
        this.player.pos.x < this.pos.x &&
        blockLeft.frame.id !== "floor"
      ) {
        if (this.vel.x > -80) applyForce(this, { x: -this.speed / 6, y: 0 });
        this.facing = "left";
      } else {
        this.vel.x = 0;
      }
    }

    let r = integrate(this, dt);

    r = wallslide(this, this.map, r.x, r.y);
    this.pos.increase(r);

    if (r.hits.up) {
      this.vel.y = 0;
    }

    if (!r.hits.down) {
      this.falling = true;
      this.jumping = true;
    } else {
      this.falling = false;
      this.jumping = false;
    }
    if (!this.jumping) {
      if (r.hits.left && this.facing === "left") {
        this.jumping = true;
        this.jump = true;
      }
      if (r.hits.right && this.facing === "right") {
        this.jumping = true;
        this.jump = true;
      }
    }

    if (distance(this.pos, this.player.pos) < 40) {
      this.vel.x = 0;
      this.attackPlayer(dt);
    }
  }
}
