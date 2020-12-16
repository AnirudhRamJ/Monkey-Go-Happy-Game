var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey, monkey_running, ground, invisibleGround, score, survivalTime, restart, restartImage,groundImage;
var fruitGroup, obstacleGroup;

localStorage["HighestSurvivalTime"] = 0;

function preload() { 
  
  monkey_running = loadAnimation("monkey_0.png", "monkey_1.png","monkey_2.png", "monkey_3.png", "monkey_4.png", "monkey_5.png", "monkey_6.png", "monkey_7.png", "monkey_8.png");
  
  monkey_collided = loadAnimation("monkey_1.png");
   
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  restartImage = loadImage("restart.png");
  groundImage = loadImage("ground.jpg");
}

function setup() {
  createCanvas(800, 500);
  
  monkey = createSprite(50,460,20,50);
  monkey.addAnimation("running", monkey_running);
  monkey.addAnimation("collided", monkey_collided);
  monkey.scale = 0.15;
  monkey.debug = false;
  
  ground = createSprite(200,487,800,25);
  ground.addImage(groundImage);
  
  // Create Obstacle and Fruit Groups
  fruitGroup = createGroup();
  obstacleGroup = createGroup();
  
  restart = createSprite(400,250,50,50);
  restart.addImage(restartImage);
  restart.scale = 0.8;
  restart.visible = false;
  
  score = 0;
  survivalTime = 0;
}

function draw() {
  
  background(135,206,235);
  //displaying score
  fill("black");
  textSize(15);
  text("Survival Time: " + survivalTime, 550, 25);
  text("Score: "+ score, 700, 25);
  
  if (gameState === PLAY) {
    
    survivalTime = survivalTime + Math.round(getFrameRate()/60);
    
    restart.visible = false;
    
    spawnFruits();
    spawnObstacles();
    
    //jump when the space key is pressed 
    if (keyDown("space") && monkey.y > 30) {
        monkey.velocityY = -12;
    }
    
    monkey.velocityY = monkey.velocityY + 0.8;
    
    if (monkey.isTouching(fruitGroup)) {
      score = score + 50;
      fruitGroup.destroyEach();
    }
    
    if (monkey.isTouching(obstacleGroup)) {
      gameState = END;
    }
  } else if (gameState === END) {
    
    restart.visible = true;
    
    //set velocity of each game object to 0
    ground.velocityX = 0;
    monkey.velocityY = 0;
    monkey.changeAnimation("collided", monkey_collided);
    obstacleGroup.setVelocityXEach(0);
    fruitGroup.setVelocityXEach(0);
    
    //set lifetime of the game objects so that they are never destroyed
    obstacleGroup.setLifetimeEach(-1);
    fruitGroup.setLifetimeEach(-1);
    
    if (mousePressedOver(restart)) {
    reset();    
    }  
  }
  
  
  //stop monkey from falling down
  monkey.collide(ground);
  
  drawSprites();
}

function spawnFruits() {
  
  // Spawn the bananas
  if (frameCount % 60 === 0) {
    var banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(200,380));
    banana.addImage(bananaImage);
    //add each fruit to the group
    
    banana.scale = 0.1;
    banana.velocityX = -3;
    
    //assign lifetime to the variable
    banana.lifetime = 200;
    
    fruitGroup.add(banana);
  }
}

function spawnObstacles() {  
  // Spawn the obstacles
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600,440,10,40);       
    obstacle.addImage(obstacleImage);    
    obstacle.setCollider("circle", 0, 0, 180);
  
    obstacle.scale = 0.1;
    obstacle.velocityX = -5;
    
    //assign lifetime to the variable
    obstacle.lifetime = 300;
    
    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}

function reset() {

  gameState = PLAY;
  monkey.changeAnimation("running", monkey_running);
  restart.visible = false;
  
  obstacleGroup.destroyEach();
  fruitGroup.destroyEach();  
  
  if (localStorage["HighestSurvivalTime"] < score) {
    localStorage["HighestSurvivalTime"] = score;
  }
  console.log(localStorage["HighestSurvivalTime"]);
  
  survivalTime = 0;
  score = 0;
}
