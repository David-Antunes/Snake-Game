
let engine, snake, ctx;

const WIDTH = 60;
const HEIGHT = 60;
const SIZE = 10;

const SNAKE_COLOUR = "#ffc0cb";
const FOOD_COLOUR = "#aa0000";

class Snake
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		this.dx = SIZE;
		this.dy = 0;
		this.draw();
		this.tail = [];
	}

	drawSnake()
	{
		this.draw();
		this.drawTail();
	}

	draw()
	{

		ctx.fillStyle = SNAKE_COLOUR;

		ctx.fillRect(this.x, this.y, SIZE, SIZE);
	}

	moveTail(x,y)
	{

		
		if(this.tail.length == 0)
			return;
		
		let prevX = this.tail[this.tail.length - 1].x;
		let prevY = this.tail[this.tail.length - 1].y;
		if(this.tail.length == 1)
			this.tail[0].undraw();
		this.tail[this.tail.length - 1].x = x;
		this.tail[this.tail.length - 1].y = y;
		for(let i = this.tail.length - 2; i >= 0; i--)
		{
			let auxX = this.tail[i].x;
			let auxY = this.tail[i].y;
			// undraws the last tail from the canvas
			if(i == 0)
				this.tail[i].undraw();
			this.tail[i].x = prevX;
			this.tail[i].y = prevY;
			prevX = auxX;
			prevY = auxY;
		}
	}

	undraw()
	{
		ctx.clearRect(this.x-1,this.y -1, SIZE + 2, SIZE + 2);
	}

    move([dx,dy])
    {

		if(!this.oppositeMove(dx,dy))
			this.updateDirection(dx,dy);

			if(this.outOfBounds())
				engine.gameLost();

		if(this.isThereFood(dx,dy))
		{
			this.eatFood(dx,dy);
			return;
		}

		if(this.isThereMyTail(dx,dy))
		{
			engine.gameLost();
			return;
		}

		this.moveSnake();
	}

	isThereFood(dx,dy)
	{
		let nextX = this.x + dx;
		let nextY = this.y + dy;

		if(engine.food.isOverlapping(nextX,nextY))
			return true;
		
		return false;

	}

	isThereMyTail(dx,dy)
	{
		if(this.tail.length <= 1)
			return false;


		for(let i = 1; i < this.tail.length; i++)
		{
			if(this.tail[i].equals(this.x + dx, this.y + this. dy))
				return true;
		}
		return false;

	}


	eatFood()
	{
			this.headToTail(engine.food);
			engine.food.eatFood();
			console.log(this.tail.length);
	}

	moveSnake()
	{
		let prevX = this.x;
		let prevY = this.y;
		if(this.tail.length == 0)
			this.undraw();
		this.x += this.dx;
		this.y += this.dy;
		this.draw();

		this.moveTail(prevX,prevY);
	}

	oppositeMove(dx,dy)
	{
		if((dx + this.dx) == 0 && dx != this.dx)
			return true;
			if((dy + this.dy) == 0 && dy != this.dy)
			return true;
		
		
		return false;
	}

	outOfBounds()
	{
		if(this.x < 0 || this.x > (WIDTH * SIZE) -(SIZE))
			return true;
		else if(this.y < 0 || this.y > (HEIGHT * SIZE) -(SIZE))
			return true;

		return false;
	}

	headToTail(food)
	{
		this.tail.push(new Tail(this.x, this.y));
		this.x = food.x;
		this.y = food.y;
		this.draw();
	}

	updateDirection(dx,dy)
	{
		if(dx == 0 && dy == 0)
			return;
		this.dx = dx;
		this.dy = dy;
	}
	
}


class Tail
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
	}

	move(x,y)
	{
		this.x = x;
		this.y = y;
	}

	draw()
	{
		ctx.fillStyle = "#ffc0cb";

		ctx.fillRect(this.x, this.y, SIZE, SIZE);
	}

	undraw()
	{
		ctx.clearRect(this.x,this.y, SIZE, SIZE);
	}

	equals(x,y)
	{
		if(x == this.x && this.y == y)
			return true;
		return false;
	}
}


// Make it dodge
class Food
{
	constructor(x,y)
	{
		this.x = x;
		this.y = y;
		this.draw();
	}

	isOverlapping(x,y)
	{
		if(this.x == x && this.y == y)
		{
			return true;
		}
		return false;

	}
	eatFood()
	{
		engine.getNewFood();
		engine.foodCounter++;
	}

	draw()
	{
		// Set the fill style to red
		ctx.fillStyle = FOOD_COLOUR;

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
		snake = new Snake(10 * SIZE, 30 * SIZE);
		this.foodCounter = 0;
		this.food = this.newFood();
        
    }

    getKey() {
		let k = this.key;
		switch( k ) {
			case 37:  	return [-SIZE, 0]; //  LEFT, O, J
			case 38:  	return [0, -SIZE]; //    UP, Q, I
			case 39:  	return [SIZE, 0];  // RIGHT, P, L
			case 40:  	return [0, SIZE];  //  DOWN, A, K
			default: 	return [0, 0];
		};	
	}
	setupEvents() {
		addEventListener("keydown", this.keyDownEvent, false);
		addEventListener("keyup", this.keyUpEvent, false);
		setInterval(this.animation, 1000 / 5);
	}

	keyDownEvent(k) {
		engine.key = k.keyCode;

    }
    
	keyUpEvent(k) {
    }
    
    animation()
    {
		engine.collectedFood();
		snake.move(engine.getKey());
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

	}

	collectedFood()
	{
		let c = document.getElementById("Food");
		c.value = this.foodCounter;
	}

	gameLost()
	{
		ctx.clearRect(0,0, 600, 600);
		this.foodCounter = 0;
		this.food = this.newFood();
		snake = new Snake(10 * SIZE, 30 * SIZE);
	}
    
}

function rand(n) {		// random number generator
	return Math.floor(Math.random() * (n -1));
}


function startGame()
{
	engine = new Engine();
}
