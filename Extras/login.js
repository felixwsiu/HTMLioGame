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
var loggedIn = false;
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
        window.location.href = "StartScreen.html";
    }
}