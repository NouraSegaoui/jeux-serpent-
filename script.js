window.onload = function() 
{
    var canvasWidth=900;
    var canvasHeight=600;
    var ctx;
    var delay =100;
    var blockSize=20;
    var snakee;
    var applee;
    var widthInBlock = canvasWidth/blockSize;
    var heightInBlock = canvasHeight/blockSize;
    var score;
    var timeout;

    init();

    function init ()
    {
        var canvas = document.createElement('canvas');
        canvas.height = canvasHeight;
        canvas.width = canvasWidth;
        canvas.style.border = "30px solid gray  ";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block"; 
        canvas.style.backgroundColor="#ddd"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new Snake ([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([10,10]);
        score = 0;
        refreshcanvas();

    }
    function refreshcanvas()
    { 
        console.log("Refresh Canvas");
        snakee.advance();
        
        if (snakee.checkCollision())
        {
            gameOver();
        }
        else
        {
            if(snakee.isEatingApple(applee))
            {
                score++; 
                snakee.ateApple = true;
                do
                {
                    applee.setNewPosition();
                }
                while(applee.isOnSnake(snakee))
            }
            ctx.clearRect(0,0,canvasWidth,canvasHeight);
            drawScore();
            snakee.draw();
            applee.draw();
            timeout = setTimeout(refreshcanvas,delay);
        }
        

    }
    function gameOver ()
    {
        ctx.save();
        ctx.font = "bold 50px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centerX = canvasWidth/2;
        var centerY = canvasHeight/2;
        ctx.strokeText("Game Over",centerX,centerY-180);
        ctx.fillText("Game Over",centerX,centerY-180);
        ctx.font = "bold 20px sans-serif";
        ctx.strokeText("appuyer sur la touche Espace pour rejouer",centerX,centerY -130);
        ctx.fillText("appuyer sur la touche Espace pour rejouer",centerX,centerY -130);
        ctx.restore();
    }
    function restart ()
    {
        snakee = new Snake ([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
        applee = new Apple([10,10]);
        score=0;
        clearTimeout(timeout);
        refreshcanvas();
    }
    function drawScore()
    {
        ctx.save();
        ctx.font = "bold 200px sans-serif";
        ctx.fillStyle = "gray";
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;

        ctx.fillText(score.toString(),centreX,centreY);
        ctx.restore(); 
    }
    function drawBlock(ctx, position)
    {
        var x= position[0]*blockSize;
        var y= position[1]*blockSize;
        ctx.fillRect(x,y,blockSize,blockSize);
    }
    function Snake (body, direction)
    {
        this.body=body;
        this.direction = direction;
        this.ateApple = false;
        this.draw=function()
        {
            ctx.save();
            ctx.fillStyle="#ff0000";
            for(var i =0;i <this.body.length;i++)
            {
                drawBlock(ctx, this.body[i]);
            }
            ctx.restore();
                
        };
        this.advance= function()
        {
            var nextposition = this.body[0].slice();
            switch(this.direction)
            {
                case "left":
                    nextposition[0]-=1;
                    break;
                case "right":
                    nextposition[0]+=1;
                    break;
                case "down":
                    nextposition[1]+=1;
                    break;
                case "up":
                    nextposition[1]-=1;
                    break;
                default:
                    throw("invalid Direction ");
            }
            this.body.unshift(nextposition);
            if(!this.ateApple)
                this.body.pop();
            else 
                this.ateApple = false;
        };
        this.setDirection = function(newDirection)
        {
            var allowedDirection;
            switch(this.direction)
            {
                case "left":
                case "right":
                    allowedDirection=["up","down"];
                    break;
                case "down":
                case "up":
                    allowedDirection=["left","right"];
                    break; 
                default:
                        throw("invalid Direction ");
            }
            if(allowedDirection.indexOf(newDirection) > -1)
            {
                this.direction = newDirection;
            }
        };
        this.checkCollision = function()
        {
            var wallCollision =false;
            var snakeCollision =false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX =0;
            var minY = 0;
            var maxX = widthInBlock-1;
            var maxY =heightInBlock-1;
            var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
            var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
             
            if( isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
            {
                wallCollision = true ;
            }
            for (var i=0 ; i <rest.length; i++)
            {
                if(snakeX === rest[i][0] && snakeY===rest[i][1])
                {
                    snakeCollision = true;
                }
            }
            return wallCollision || snakeCollision; 
        };
        this.isEatingApple = function(appleEat)
        {
            var head =this.body[0];
            if(head[0]===appleEat.position[0] && head[1]===appleEat.position[1])
            
                return true;
            
            else
                return false;
        };
    }

    function Apple(position)
    { 
        this.position= position;
        this.setNewPosition = function()
        {
            var newX = Math.round(Math.random()*(widthInBlock-1));
            var newY = Math.round(Math.random()*(heightInBlock-1));
            this.position = [newX,newY];
        };
        this.isOnSnake  = function(snakeToCheck)
        {
            var isOnSnake = false;
            for(var i=0; i< snakeToCheck.body.length;i++)
            {
                if(this.position[0]=== snakeToCheck.body[i][0] && this.position[1]=== snakeToCheck.body[i][1])
                {
                    isOnSnake = true;
                }
            }
            return isOnSnake;
        };
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle="#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize+radius;
            var y = this.position[1]*blockSize+radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true);
            ctx.fill();
            ctx.restore();
        };

    }



    document.onkeydown = function handleKeyDown(e)
    {
        var key=e.keyCode;
        var newDirection;
        switch(key)
        {
            case 37:
                newDirection="left";
                break;
            case 38:
                newDirection="up";
                break;
            case 39:
                newDirection="right";
                break;
            case 40:
                newDirection="down";
                break;
            case 32:
                restart();
                break;
            default:
                return;
        }
        snakee.setDirection(newDirection);
    }
}
