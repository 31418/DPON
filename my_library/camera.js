class Camera extends AddRemoveUpdate {
  constructor(subject, viewport, worldSize = viewport) {
    super();

    this.pos = { x: 0, y: 0 };
    this.w = viewport.w;
    this.h = viewport.h;

    this.worldSize = worldSize;

    this.subject = null;
    this.offset = { x: 0, y: 0 };

    this.shakePower = 0;
    this.shakeDecay = 0;
    this.shakeLast = { x: 0, y: 0 };

    this.flashTime = 0;
    this.flashDuration = 0;
    this.flashRect = null;

    this.setSubject(subject);
  }

  // -------------------------------------------------------
  // SUBJECT
  // -------------------------------------------------------
  setSubject(e) {
    this.subject = e ? e.pos || e : this.pos;
    this.offset = { x: 0, y: 0 };

    if (e && e.w) {
      this.offset.x += e.w / 2;
      this.offset.y += e.h / 2;
    }
    if (e && e.anchor) {
      this.offset.x -= e.anchor.x;
      this.offset.y -= e.anchor.y;
    }
  }

  // -------------------------------------------------------
  // CAMERA MOVEMENT
  // -------------------------------------------------------
  _focus(ease = 0.1) {
    const { pos, w, h, worldSize, subject, offset } = this;

    const centeredX = subject.x + offset.x - w / 2;
    const maxX = worldSize.w - w;
    const x = -clamp(centeredX, 0, maxX);

    const centeredY = subject.y + offset.y - h / 2;
    const maxY = worldSize.h - h;
    const y = -clamp(centeredY, 0, maxY);

    pos.x = mix(pos.x, x, ease);
    pos.y = mix(pos.y, y, ease);
  }

  // -------------------------------------------------------
  // SCREEN FLASH
  // -------------------------------------------------------
  flash(duration = 0.5, color = "white") {
    if (this.flashRect) return;

    this.flashDuration = duration;
    this.flashTime = duration;

    this.flashRect = this.add(new Rect(this.w, this.h, { fill: color }));
    this.flashRect.style.fill = color;
  }

  _flash(dt) {
    if (!this.flashRect) return;

    this.flashTime -= dt;
    if (this.flashTime <= 0) {
      this.remove(this.flashRect);
      this.flashRect = null;
      return;
    }

    const t = this.flashTime / this.flashDuration;
    this.flashRect.alpha = t;
    this.flashRect.pos.x = -this.pos.x;
    this.flashRect.pos.y = -this.pos.y;
  }

  // -------------------------------------------------------
  // CAMERA SHAKE
  // -------------------------------------------------------
  shake(power = 8, duration = 0.5) {
    this.shakePower = power;
    this.shakeDecay = power / duration;
  }

  _shake(dt) {
    if (this.shakePower <= 0) {
      this.shakeLast.x = 0;
      this.shakeLast.y = 0;
      return;
    }

    this.shakeLast.x = randf(-this.shakePower, this.shakePower);
    this.shakeLast.y = randf(-this.shakePower, this.shakePower);

    this.pos.x += this.shakeLast.x;
    this.pos.y += this.shakeLast.y;

    this.shakePower -= this.shakeDecay * dt;
  }

  _unShake() {
    this.pos.x -= this.shakeLast.x;
    this.pos.y -= this.shakeLast.y;
  }

  // -------------------------------------------------------
  // UPDATE LOOP
  // -------------------------------------------------------
  update(dt, t) {
    // Unapply last shake offset
    this._unShake();

    // Smoothly follow the subject
    this._focus(0.1);

    // Apply new shake
    this._shake(dt);

    // Flash
    this._flash(dt);

    // Update children normally
    super.update(dt, t);
  }

  // -------------------------------------------------------
  // DRAW: THIS IS THE MAGIC PART
  // -------------------------------------------------------
  draw(ctx) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);

    super.draw(ctx);

    ctx.restore();
  }
}

class Bling extends AddRemoveUpdate {
  constructor(display, duration = 0.5, speed = 5, target, camera_element) {
    super();
    this.add(display || new Rect(32, 32, { fill: "yellow" }));
    this.duration = duration;
    this.life = duration;
    this.speed = speed;
    this.target = target;
    this.camera = camera_element;
    this.upped = 0;
    this.pos = { x: 0, y: 0 };
  }
  update(dt, t) {
    super.update(dt, t);
    this.upped += dt * this.speed;

    const targetX = this.target.pos.x + this.camera.pos.x;
    const targetY = this.target.pos.y + this.camera.pos.y - 10 - this.upped;

    this.pos.x = targetX;
    this.pos.y = targetY;

    this.alpha = this.life / this.duration;
    if ((this.life -= dt) <= 0) {
      this.dead = true;
    }
  }
}

class Trigger {
  constructor(hitBox, action) {
    const { x, y, w, h } = hitBox;
    this.w = w;
    this.h = h;
    if (x || y) {
      this.hitBox = { x, y, w, h };
    }
    this.action = action;
  }
  trigger() {
    if (this.action) {
      this.action();
    }
  }
  update(dt, t) {}
}
