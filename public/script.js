(function() {

//canvas signature:

//declarations:
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var signature = document.getElementById("signatureId");
var clearBtn = document.getElementById("clearBtn");

//event listeners:
canvas.addEventListener('mousedown', setPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseenter', setPosition);
// clearBtn.addEventListener('click', clear);
canvas.addEventListener('mouseup', dataToUrl);

//position X/Y:
function setPosition(e) {
  posX = e.clientX - canvas.offsetLeft;
  posY = e.clientY - canvas.offsetTop;
}

//draw signature:
function draw(e) {
  // mouse button must be pressed
  if (e.buttons !== 1) return;

  context.beginPath(); // begin
  context.moveTo(posX, posY); // from
  setPosition(e);
  context.lineTo(posX, posY); // to
  context.stroke(); // draw it
}

///submit data button:
function dataToUrl(){
    var dataUrl = canvas.toDataURL();
    signature.value = dataUrl;
    console.log(dataUrl);
}

///clear canvas button:
function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

})();
