class Particle extends TileSprite {
  constructor(display) {
    super(display);
    this.pos = new Vector();
    this.vel = new Vector();
    this.alpha = 1;
  }
  reset() {
    this.vel.set(randf(-5, 5), randf(-5, 5));
    this.life = randf(0.6, 0.8);
    this.pos.set(0, 0);
  }
  update(dt) {
    const { vel, life } = this;
    if (life < 0) {
      return;
    }
    this.life -= dt;
    if (this.life > 0) {
      this.alpha = this.life * 1.25;
    } else {
      this.alpha = 0.01;
    }

    this.pos.increase(vel);
    this.pos.x += 1;
  }
}

class ParticleMaker extends AddRemoveUpdate {
  constructor(amount, display) {
    super();
    this.particles = Array.from(new Array(amount), () =>
      this.add(new Particle(display))
    );
    this.pos = new Vector();
  }
  play(pos, camera) {
    this.pos.copy(pos);

    this.particles.forEach((p) => {
      p.reset();
    });
  }
}
