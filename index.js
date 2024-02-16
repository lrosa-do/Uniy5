"use strict";


const Width  = window.innerWidth;
const Height = window.innerHeight;



let progress = 0;
let totalResources = 6; 
let loadComplete = false;
let barWidth = 200;
let barHeight = 20;

function preload()
{

        console.log('Preload');
        
         Game.LoadImage('assets/playerShip1_orange.png', 'player');
         progress++;


         Game.LoadImage('assets/ufoRed.png', 'ufo');
         progress++;
  
         Game.LoadImage('assets/gun02.png', 'gun');
         progress++;

         Game.LoadImage('assets/explosion.png', 'explosion');
         progress++;


        Game.LoadImage('assets/bullet_2_blue.png', 'bullet_blue');
        progress++;

        Game.LoadImage('assets/bullet_2_orange.png', 'bullet_orange');
        progress++;


        Game.LoadImage('assets/wabbit_alpha.png', 'wabbit');
        progress++;

  
       
   
    // for (let i = 0; i < totalResources; i++) 
    // {
    //     setTimeout(() => 
    //     {
    //         progress++;
    //     }, i * 1000); // Simula um atraso de 1 segundo por recurso
    // }
  

}

function success(font) 
{
       console.log('Font loaded:', font);
       textFont(font);
}
  
  function failure(event) {
    console.error('Oops!', event);
  }






function setup() 
{
   // loadFont('fonts/Inconsolata-Bold.otf', success, failure);
  

    let canvas = document.getElementById("canvas");
    createCanvas(Width, Height, P2D, canvas);
    //createCanvas(Width, Height, WEBGL, canvas);
    
    resizeCanvas(Width, Height);
    let container = document.getElementById("container");

    

   
    Game.Init();

    Game.AddScene(new MainScene(), 'MainScene');
    Game.AddScene(new CollideScene(), 'CollideScene');
    Game.ChangeScene('CollideScene');
}


function draw() 
{

    if (!loadComplete) 
    {
        background(0);
        fill(255);
        textSize(24);
        textAlign(CENTER, CENTER);
        text(`Carregando Imagens ... [${progress}/${totalResources}] `, width / 2, height / 2);
        noStroke();
        fill(55, 20, 20);
        let progressWidth = map(progress, 0, totalResources, 0, barWidth);

        rect(width / 2 - barWidth / 2, height / 2 + 50, barWidth, barHeight);
        fill(10, 155, 10);
        //rect(width / 2 - barWidth / 2, height / 2 + 50, barWidth * (progress / totalResources), barHeight);
        rect(width / 2 - barWidth / 2, height / 2 + 50, progressWidth, barHeight);



    
        if (progress >= totalResources) 
        {
            loadComplete = true;
            Game.Start();
        }


    } else 
    {
        background(45);
        Game.Update(deltaTime/100);
        Game.Render();
     }
   
}


function windowResized() 
{
    resizeCanvas(windowWidth, windowHeight); 
    if (!loadComplete) return;
    Game.Resize(windowWidth, windowHeight);
}