function center(entity) {
  return {
    x: entity.pos.x + 16,
    y: entity.pos.y + 16,
  };
}

function distanceEntity(a, b) {
  return distance(center(a), center(b));
}

function bounds(entity) {
  const { w, h, pos, hitBox } = entity;
  const hit = hitBox || { x: 0, y: 0, w, h };
  return {
    x: hit.x + pos.x,
    y: hit.y + pos.y,
    w: hit.w - 1,
    h: hit.h - 1,
  };
}

function hit(e1, e2) {
  a = bounds(e1);
  b = bounds(e2);
  return (
    a.x + a.w >= b.x && a.x <= b.x + b.w && a.y + a.h >= b.y && a.y <= b.y + b.h
  );
}

function isTouching(e1, e2) {
  const a = {
    left: e1.pos.x,
    right: e1.pos.x + e1.bounds.w,
    top: e1.pos.y,
    bottom: e1.pos.y + e1.bounds.h,
  };

  const b = {
    left: e2.pos.x,
    right: e2.pos.x + e2.bounds.w,
    top: e2.pos.y,
    bottom: e2.pos.y + e2.bounds.h,
  };

  // Check for any overlap
  const horizontalTouch = a.left < b.right && a.right > b.left;
  const verticalTouch = a.top < b.bottom && a.bottom > b.top;

  return horizontalTouch && verticalTouch;
}

function hits(entity, container, hitCallback) {
  const a = bounds(entity);
  container.map((e2) => {
    const b = bounds(e2);
    if (
      a.x + a.w >= b.x &&
      a.x <= b.x + b.w &&
      a.y + a.h >= b.y &&
      a.y <= b.y + b.h
    ) {
      hitCallback(e2);
    }
  });
}

function ent_angle(a, b) {
  return angle(center(a), center(b));
}
