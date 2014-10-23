
function update() {
    var fireworks = window.Fireworks.fireworks;
    var context = window.Fireworks.context;

    var width = context.canvas.width;
    var height = context.canvas.height;
    var max_radius = window.Fireworks.max_radius;

    fireworks.forEach( function( firework ) {
        firework.update( context );
    });

    //Remove any inactive fireworks
    window.Fireworks.fireworks = fireworks.filter(function(firework) {
        return firework.active;
    });

    if(Math.random() < 0.1) {
        window.Fireworks.fireworks.push(Firework({
            speed: Math.ceil(Math.random() * 5),
            x: Math.floor(Math.random() * width ) + (max_radius/2),
            y: height,
            max_radius: max_radius
        }));
    }
}

function draw() {
    var context = window.Fireworks.context;
    var width = window.Fireworks.canvasDiv.width;
    var height = window.Fireworks.canvasDiv.height;

    context.clearRect(0, 0, width, height);

    window.Fireworks.fireworks.forEach( function( firework ) {
        firework.draw( context );
    });
}

function start() {
    update();
    draw();
    window.requestAnimFrame( start );
}

function resize(evt){
    var canvasDiv = window.Fireworks.canvasDiv;

    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    
    canvasDiv.width = newWidth - 20;
    canvasDiv.height = newHeight - 20;
}

function init(){
    window.Fireworks = window.Fireworks || {
        context: undefined,
        fireworks: [],
        max_radius: 50
    };

    var canvasDiv = document.getElementById('canvasId');
    if(!canvasDiv.getContext){
        logMsg("Canvas: Not supported");
        return;
    }
    window.Fireworks.canvasDiv = canvasDiv;
    window.Fireworks.context = canvasDiv.getContext('2d');

    resize();

    window.addEventListener('resize', resize, false);
    window.addEventListener('orientationchange', resize, false);

    //Prevent user dragging here to keep the canvas stationary
    document.body.addEventListener('touchmove', function(event) {
            event.preventDefault();
    }, false);

    //Create a common way to request the animation frame
    window.requestAnimFrame = (function(){
        return window.requestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.oRequestAnimationFrame ||
               window.msRequestAnimationFrame ||
               function( callback ) {
                    window.setTimeout(callback, 1000/60);
               };
    })();

    start();
}

window.addEventListener('load', init, false);