console.log('hi');
var ctx = document.getElementById("ctx").getContext("2d");
ctx.font = '30px Arial';
var socket  = io(); 

socket.on('newPositions',function(data){
     ctx.clearRect(0,0,500,500);
    for (var i = 0; i< data.length ; i++){
        ctx.fillText(data[i].number,data[i].x,data[i].y);
    }
        
});

