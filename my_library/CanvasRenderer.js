class Text {
  constructor(text = "", style = {}) {
    this.pos = { x: 0, y: 0 };
    this.text = text;
    this.style = style;
  }
}
function isInCameraView(e, camera_element) {
  const distance = distanceNegB(e.pos, center(camera_element.pos));
  if (distance > 1000) {
    if (e.pos.x === 1280 && e.pos.y === 1280) {
      console.log("out of range");
    }

    return false;
  } else {
    if (e.pos.x === 128 && e.pos.y === 128) {
      console.log(
        distanceNegB(e.pos, camera_element.pos),
        "e",
        e.pos,
        camera_element.pos
      );
    }

    return true;
  }
}

class CanvasRenderer {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.view = document.createElement("canvas");
    this.view.width = w;
    this.view.height = h;
    this.ctx = this.view.getContext("2d");
  }

  render(container) {
    const { ctx } = this;
    if (container.visible == false) {
      return;
    }

    function renderRec(container, camera) {
      if (container.visible == false || container.alpha === 0) {
        return;
      }
      if (container.alpha) {
        ctx.save();
        ctx.globalAlpha = container.alpha;
      }

      container.children.forEach((child) => {
        if (child.visible == false || child.alpha === 0) {
          return;
        }
        ctx.save();
        if (child.alpha) {
          ctx.globalAlpha = child.alpha;
        }
        if (child.pos) {
          ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
        }

        if (child.anchor) {
          ctx.translate(child.anchor.x, child.anchor.y);
        }
        if (child.rotation) {
          const px = child.pivot ? child.pivot.x : 0;
          const py = child.pivot ? child.pivot.y : 0;
          ctx.translate(px, py);
          ctx.rotate(child.rotation);
          ctx.translate(-px, -py);
        }
        if (child.scale) {
          ctx.scale(child.scale.x, child.scale.y);
        }
        if (child.style && child.w && child.h) {
          ctx.fillStyle = child.style.fill;
          ctx.fillRect(0, 0, child.w, child.h);
        }

        if (child.text) {
          ctx.font = child.style.font || "30pt sans-serif";
          ctx.fillStyle = child.style.fill || "black";
          ctx.textAlign = child.style.align || "left";

          ctx.fillText(child.text, 0, 0);
        }
        if (child.texture) {
          const img = child.texture.img;
          if (child.tileW) {
            ctx.drawImage(
              img,
              child.frame.x * child.tileW,
              child.frame.y * child.tileH,
              child.tileW,
              child.tileH,
              0,
              0,
              child.tileW,
              child.tileH
            );
          } else {
            ctx.drawImage(child.texture.img, 0, 0);
          }
        }

        if (child.children) {
          if (child.worldSize) {
            renderRec(child, child);
          } else {
            renderRec(child, camera);
          }
        }

        ctx.restore();
      });

      if (container.alpha) {
        ctx.restore();
      }
    }
    ctx.clearRect(0, 0, this.w, this.h);
    renderRec(container);
  }
}

class Rect {
  constructor(w, h, pos, style = { fill: "#333" }) {
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.style = style;
  }
}
