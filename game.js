"use strict";

class PlayerScript extends Component
{
    constructor()
    {
        super('PlayerScript');
        this.speed = 5;
        this.target = new Vector2(Game.Width/2,Game.Height/2);
    
    }

    moveTo(x,y)
    {

        this.target.set(x,y);
    }






    update(dt)
    {
      

        let distance = Vector2.Distance(this.gameObject.transform.position, this.target);

        this.gameObject.transform.pointToMouse(dt * 0.5 * (distance/100) , -90);


        if (distance > 20)
        {
            this.gameObject.transform.movex(this.speed * dt * (distance/100), this.gameObject.transform.rotation+90);
        }

        // if (keyIsDown(LEFT_ARROW))
        // {
        //     this.gameObject.transform.rotation -= this.speed * dt;
        // }
        // if (keyIsDown(RIGHT_ARROW))
        // {
        //     this.gameObject.transform.rotation += this.speed * dt;
        // }
        // if (keyIsDown(UP_ARROW))
        // {
        //     this.gameObject.transform.movex(this.speed * dt, this.gameObject.transform.rotation+90);
        // }
        // if (keyIsDown(DOWN_ARROW))
        // {
        //     this.gameObject.transform.movex(-this.speed * dt, this.gameObject.transform.rotation+90);
        // }
    }
}


class Kickback extends Component 
{
    constructor(force, duration) 
    {
        super('Kickback');
        this.recoil=0;
        this.y=0;
      
    }

    ready()
    {
        this.y = this.gameObject.transform.position.y;

        this.tweenStart = new Tween(this.gameObject.transform.position, 'y', this.y,this.y+10, 0.5,Ease.Linear);
        this.tweenEnd = new Tween(this.gameObject.transform.position, 'y',  this.y+10,this.y,1,Ease.Linear);

        if (this.tweenStart)
        {
            this.tweenStart.OnComplete = () => 
            {
                this.tweenEnd.start();
            }
        }
       

    }


    update(dt) 
    {
        
       // this.recoil = Max(0, this.recoil - 1);
       // this.gameObject.transform.position.y = this.y - LengthDirY(this.recoil, 90.0);
       
          
    }

  
    start() 
    {
       this.tweenStart.start();
       this.recoil = 18;
    }
}

class BulletScript extends Component
{
    constructor(x,y,angle)
    {
        super('BullerScript');
        this.speed = 25;
        this.acceleration = 5.5;
        this.x = x;
        this.y = y;
        this.angle = angle; 
        this.kickbackForce = 5; // Força inicial do coice
        this.kickbackDuration = 0.1; // Duração do coice em segundos
        this.kickbackStartTime = 0;
   
    }

    ready()
    {
        this.gameObject.transform.position.x = this.x;
        this.gameObject.transform.position.y = this.y;
        this.gameObject.transform.rotation = this.angle -90;
        this.gameObject.AddComponent(new Deletor(10));
        this.gameObject.AddComponent(new Sprite(Game.GetImage('bullet_orange')));
        let action1 = new Tween(this.gameObject.transform.scale, 'x', 0.1, 2, 2, Ease.Linear);
        action1.start();
        action1.OnComplete = () =>
        {
            action1.remove();
        }
        let action2 = new Tween(this.gameObject.transform.scale, 'y', 0.1, 2, 2, Ease.Linear);
        action2.start();
        action2.OnComplete = () =>
        {
            action2.remove();
        }

        this.gameObject.CenterBySprite();
    }

    update(dt)
    {
        this.acceleration += this.speed * dt;
        this.gameObject.transform.movex(this.acceleration  * dt, this.angle);
    }

}


class MainScene extends Scene
{
    ready()
    {
        console.log('MainScene Ready');

        this.bulleteTime = 0;
        this.bulletInterval = 0.1;
        this.side = 0;
       
        let player = new GameObject('Player');
        player.transform.position.x = Width/2;
        player.transform.position.y = Height/2;
        player.bound.set(0,0,99, 75);

   
        player.AddComponent(new PlayerScript());
        player.AddComponent(new Sprite(Game.GetImage('player')));
        player.CenterBySprite();

        let Leftcano = new GameObject('LeftCano');
        Leftcano.transform.position.x = 20;
        Leftcano.transform.position.y = 30;
        Leftcano.AddComponent(new Sprite(Game.GetImage('gun')));
        Leftcano.AddComponent(new Kickback(5, 0.1));
        Leftcano.CenterBySprite();

        let Rightcano = new GameObject('RightCano');
        Rightcano.transform.position.x = 80;
        Rightcano.transform.position.y = 30;
        Rightcano.bound.set(0,0,50, 50);
        Rightcano.AddComponent(new Sprite(Game.GetImage('gun')));
        Rightcano.AddComponent(new Kickback(5, 0.1));
        Rightcano.CenterBySprite();
       
        player.Add(Rightcano);
        player.Add(Leftcano);

        this.Add(player);
        frameRate(60);

        this.gamePlayer = player;
        this.leftCano = Leftcano;
        this.rightCano = Rightcano;
        
    }
    update(dt)
    {
    

       let pointA = this.rightCano.GetWorldPoint(6,-4);
       let pointB = this.leftCano.GetWorldPoint(6,-4);
       let point = this.gamePlayer.GetWorldPoint(50,-10);
       let angle = this.gamePlayer.transform.rotation ;
       let in_angle =  GetAngle(point.x, point.y,  mouseX, mouseY) - 90;
       let angleDifference = IsWithinAngleRange(angle, in_angle, 40);

     

        // noStroke();
        // fill("red");
        // circle(pointA.x, pointA.y, 5);
        // circle(pointB.x, pointB.y, 5);
        // circle(point.x, point.y, 5);

    //     text(`${int(angleDifference)} ${int(angle)} ${int(in_angle)} `, 220, 70);
        if (mouseIsPressed ) 
        {
            this.gamePlayer.GetComponent('PlayerScript').moveTo(mouseX, mouseY);
        }


        if (mouseIsPressed && angleDifference===true) 
        {
       
       
           if (millis() - this.bulleteTime > this.bulletInterval * 1000)
            {
                    this.bulleteTime = millis();
                    let bullet = new GameObject('Bullet');
                  
                    if (this.side == 0)
                    {
                        this.side = 1;
                        bullet.AddComponent(new BulletScript(pointA.x, pointA.y, angle+90));
                        this.rightCano.GetComponent('Kickback').start();



                    } else 
                    {
                        this.side = 0;
                        bullet.AddComponent(new BulletScript(pointB.x, pointB.y, angle+90));
                        this.leftCano.GetComponent('Kickback').start();
                    }
                    this.Add(bullet);
                
            }


        }


        
    }


    process()
    {
        
    }

    render()
    {
        
        fill(255);
        textSize(14);
        textAlign(LEFT, CENTER);
        let fps =int( frameRate());
        text(` ${fps}  ${this.name} ${this.Count()}`, 20, 20);

        
    }
}

