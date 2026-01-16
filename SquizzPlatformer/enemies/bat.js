class Bat extends TileSprite {
  constructor(texture, map, player, pos, game) {
    super(texture, 32, 32);

    this.map = map;
    this.player = player;

    this.pos.x = pos.x;
    this.pos.y = pos.y;

    this.game = game;

    this.speed = 80; // movement speed

    this.knockbackAmount = 0;

    this.hitBox = {
      x: 8,
      y: 8,
      w: 24,
      h: 24,
    };

    this.facing = "left";

    this.attackDamage = rand(8, 10);
    this.attackCooldown = 1.2;
    this.attackTimer = 0;

    this.health = 10;

    this.anims = new AnimManager(this);
  }

  attackPlayer(dt) {
    this.attackTimer -= dt;
    if (this.attackTimer <= 0) {
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
        this.player.xp += 1;
      }
    }
  }

  takeKnockback(amount) {
    this.knockbackAmount = amount;
  }

  update(dt, t) {
    super.update(dt, t);

    // face player
    this.facing = this.player.pos.x > this.pos.x ? "right" : "left";

    if (t % 1 < 0) {
      this.frame.x = 0;
    } else {
      this.frame.x = 1;
    }

    const offsetX = randf(-10, 10);
    const offsetY = randf(-10, 10);

    // move in straight line toward player
    const dx = this.player.pos.x - this.pos.x + offsetX;
    const dy = this.player.pos.y - this.pos.y + offsetY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 1) {
      const nx = dx / dist;
      const ny = dy / dist;

      this.pos.x += nx * this.speed * dt;
      this.pos.y += ny * this.speed * dt;
    }

    // knockback (overrides movement)
    if (this.knockbackAmount !== 0) {
      if (this.pos.x > this.player.pos.x) {
        this.pos.x += this.knockbackAmount;
      } else {
        this.pos.x -= this.knockbackAmount;
      }

      this.pos.y -= 5;
      this.knockbackAmount = 0;
    }

    // attack if close
    if (dist < 40) {
      this.attackPlayer(dt);
    }
  }
}
