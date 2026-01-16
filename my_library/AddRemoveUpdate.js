class AddRemoveUpdate {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.children = [];
  }

  add(child) {
    this.children.push(child);
    return child;
  }

  remove(child) {
    this.children = this.children.filter((c) => c !== child);
    return child;
  }

  update(dt, t) {
    this.children.forEach((child) => {
      if (child.dead) {
        this.remove(child);
      }
      if (child.update) {
        child.update(dt, t);
      }
    });
  }
  map(f) {
    return this.children.map(f);
  }
}
