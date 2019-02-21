var canvas;
var ctx;

window.onload = startGame();
function startGame() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    initialize();
    function initialize() {
        window.addEventListener('resize', resizeCanvas, false);
        resizeCanvas();
    }
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        redraw();

    }
    function redraw() {
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = '5';
        ctx.strokeRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }
    game();
}
function game() {
    ctx.fillStyle = 'white';
    ctx.font = '80px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("WELCOME TO HTMLGAME", canvas.width/2, canvas.height/2);

}