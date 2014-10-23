/*
* Simple Firework.
*/
function Firework(I) {

    //config properties
    I.max_radius = I.max_radius || 50;
    I.speed = I.speed || 1;
    I.x = I.x || 100;
    I.y = I.y || 100;

    //internal properties
    I.max_radius = I.max_radius || 50;
    I.active = true;
    I.explodeDelay = Math.floor(Math.random() * 30);
    I.explodeRadius = 2;
    I.maxExplodeRadius = Math.floor(Math.random() * I.max_radius + 15) + 15;
    I.age = 0;
    I.maxAge = Math.floor(Math.random() * 128);
    I.state = 'flying';
    I.color = '#FFFFFF';
    I.width = 2;
    I.height = 2;
    I.xVelocity = 0;
    I.yVelocity = -I.speed;

    I.draw = function( context ) {
        if(I.state === 'flying') {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        } else {
            context.beginPath();
            context.arc(I.x,I.y,I.explodeRadius,0,Math.PI*2,true);
            context.closePath();
            context.strokeStyle = this.color;
            context.stroke();
        }
    };

    I.update = function( context ) {
        I.age++;
        if(I.age >= I.maxAge && I.state === 'flying') {
            //Transition to exploding
            I.color = I.randomColor();
            I.state = 'exploding';
        }
        if(I.state === 'flying'){
            //Flying
            I.y += I.yVelocity;
            I.x += I.xVelocity;
            I.active = I.active && I.inBounds( context.canvas.width, context.canvas.height );
        } else {
            //Growing the radius of the explosion
            I.explodeRadius += 1;
            I.active = !I.doneExploding();
        }
    };

    I.doneExploding = function() {
        return I.explodeRadius >= I.maxExplodeRadius;
    };

    I.inBounds = function( width, height ) {
        return I.x >= 0 && I.x <= width && 
            I.y >= 0 && I.y <= height;
    };

    I.randomColor = function() {
        var colorArray = ['#FFFF00','#00CC00','#0066FF','#CC0000','#6600FF'];
        var color = colorArray[Math.floor(Math.random() * colorArray.length)];
        return color;
    };

    return I;
}
