var loggedIn = false;
var canvas;
var ctx;
var objPeople  = [
    {
        username: "barry",
        password: "sin"
    },
    {
        username: "felix",
        password: "siu"
    }
];

function getInfo() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    console.log("user: " + username + " pass: " + password);
    if (username == null || password == null) {
        alert("You must put in a Username/Password!");
    }
    for (i = 0; i < objPeople.length; i++) {
        if ( username === objPeople[i].username && password === objPeople[i].password) {
            console.log (username + "is logged in");
            loggedIn = true;
        }
    }
    if (loggedIn) {
        startGame();
    }
}

function startGame() {
    let header = document.getElementById("head");
    let forms = document.getElementById("inputs");
    header.style.display = "none";
    forms.style.display = "none";
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