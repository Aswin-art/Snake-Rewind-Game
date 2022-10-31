const canvasBG = document.getElementById("background"),
  ctxBG = canvasBG.getContext("2d"),
  stack = [],
  w = window.innerWidth,
  h = window.innerHeight;
const drawer = function () {
  ctxBG.fillStyle = "rgb(182, 218, 125)";
  ctxBG.fillRect(0, 0, w, h);
  stack.forEach(function (el) {
    el();
  });
  requestAnimationFrame(drawer);
};
let anim = function () {
  let x = 0,
    y = 0;
  const maxTall = Math.random() * 100 + 200;
  const maxSize = Math.random() * 10 + 5;
  const speed = Math.random() * 2;
  const position = Math.random() * w - w / 2;
  const c = function (l, u) {
    return Math.round(Math.random() * (u || 255) + l || 0);
  };
  const color = "rgb(" + c(60, 10) + "," + c(201, 50) + "," + c(120, 50) + ")";
  return function () {
    var deviation = Math.cos(x / 30) * Math.min(x / 40, 50),
      tall = Math.min(x / 2, maxTall),
      size = Math.min(x / 50, maxSize);
    x += speed;
    ctxBG.save();
    ctxBG.strokeWidth = 10;
    ctxBG.translate(w / 2 + position, h);
    ctxBG.fillStyle = color;
    ctxBG.beginPath();
    ctxBG.lineTo(-size, 0);
    ctxBG.quadraticCurveTo(-size, -tall / 2, deviation, -tall);
    ctxBG.quadraticCurveTo(size, -tall / 2, size, 0);
    ctxBG.fill();
    ctxBG.restore();
  };
};
for (let x = 0; x < 400; x++) {
  stack.push(anim());
}
canvasBG.width = w;
canvasBG.height = h;
drawer();
