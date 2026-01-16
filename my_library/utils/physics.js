function integrate(e, dt) {
  const { vel, acc, pos } = e;
  const vx = vel.x + acc.x * dt;
  const vy = vel.y + acc.y * dt;
  const x = (vel.x + vx) / 2 * dt;
  const y = (vel.y + vy) / 2 * dt;
  vel.set(vx, vy);
  acc.set(0, 0);
  return { x, y };
}

function applyForce(e, force){
    const {acc, mass = 1} = e
    acc.x += force.x / mass
    acc.y += force.y / mass
}

function applyImpulse(e, force, dt){
    applyForce(e, {x: force.x / dt, y: force.y / dt})
}