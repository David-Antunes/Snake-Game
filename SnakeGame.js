
var engine, snake, ctx;

const WIDTH = 60;
const HEIGHT = 60;
const SIZE = 10;

class Snake
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		this.dx = -SIZE;
		this.dy = 0;
	}

	draw()
	{

	}

	undraw()
	{

	}

    move([dx,dy])
    {
        
	}
	
}

class Food
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		this.draw();
	}

	isOverlapping([x,y])
	{
		if(this.x == x && this.y == y)
		{
			undraw();
			engine.getNewFood();
			engine.foodCounter++;
		}
	}

	draw()
	{
		// Set the fill style to red
		ctx.fillStyle = "#FF0000";

		// And the Stroke to black
		ctx.strokeStyle = "FF0000";

		// Create rectangle
		ctx.strokeRect(this.x, this.y, SIZE, SIZE);
		ctx.fillRect(this.x, this.y, SIZE, SIZE);


	}

	undraw()
	{
		ctx.clearRect(this.x * SIZE, this.y * SIZE, SIZE, SIZE);
	}
}

class Engine
{  
    constructor()
    {
		this.getCanvas();
		this.setupEvents();
		engine = this;
		snake = new Snake();
		this.foodCounter = 0;
		this.food = this.newFood();
        
    }

    getKey() {
		let k = this.key;
		switch( k ) {
			case 37:  	return [-1, 0]; //  LEFT, O, J
			case 38:  	return [0, -1]; //    UP, Q, I
			case 39:  	return [1, 0];  // RIGHT, P, L
			case 40:  	return [0, 1];  //  DOWN, A, K
			default: 	return [0, 0];
		};	
	}
	setupEvents() {
		addEventListener("keydown", this.keyDownEvent, false);
		addEventListener("keyup", this.keyUpEvent, false);
		setInterval(this.animationEvent, 1000 / 15);
	}

	keyDownEvent(k) {
		this.key = k.keyCode;
    }
    
	keyUpEvent(k) {
    }
    
    animation()
    {
		snake.move(this.getKey());
	}
	
	newFood()
	{	
		// Get random x and y
		let randX = rand(WIDTH);
		let randY = rand(HEIGHT);
		
		//returns a new food
		return new Food(randX * SIZE, randY * SIZE);
		
	}

	getNewFood()
	{
		this.food = this.newFood();
	}

	getCanvas()
	{
		let c = document.getElementById("myCanvas");
		ctx = c.getContext("2d");
		ctx.fillStyle = "#666666";
		ctx.fillRect(0, 0, WIDTH * SIZE, HEIGHT*SIZE);
	}

	collectedFood()
	{
		let c = document.getElementById("Food");
		c.value = this.foodCounter;
	}
    
}

function rand(n) {		// random number generator
	return Math.floor(Math.random() * (n -1));
}


function startGame()
{
	engine = new Engine();
}
