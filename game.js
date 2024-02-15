"use strict";


const PLAYER_GROUP = 1;
const ENEMY_GROUP = 2;

const PLAYER_MASK = 1;
const ENEMY_MASK = 2;
const BULLET_PLAYER_MASK = 3;
const BULLET_ENEMY_MASK = 4;




class PlayerScript extends ScriptComponent
{
    constructor()
    {
        super();
        this.speed = 5;
        this.target = new Vector2(Game.Width/2,Game.Height/2);
    
    }

    ready()
    {
        console.log('PlayerScript ready');
        this.gameObject.AddComponent(new Collider(new CircleMask(50,0,0)),PLAYER_GROUP,BULLET_PLAYER_MASK | ENEMY_MASK);
        this.gameObject.AddComponent(new Sprite(Game.GetImage('player')));
        this.gameObject.CenterBySprite();

    }

    moveTo(x,y)
    {

        this.target.set(x,y);
    }
    OnCollisionEnter(other)
    {
    
    }

    update(dt)
    {
      

        let distance = Vector2.Distance(this.gameObject.transform.position, this.target);
        let acc = (distance/100);

        if (acc>4)
        {
            acc = 4;
        }

        this.gameObject.transform.pointToMouse(dt * 0.5 * acc , -90);


        if (distance > 20)
        {
            this.gameObject.transform.movex(this.speed * dt * acc, this.gameObject.transform.rotation+90);
        }


    }
}

class EnemyScript extends ScriptComponent
{
    constructor()
    {
        super();
        this.speed = 6;
        this.speedTorque=20;
        this.player =null; 
        this.animation = 0;
        this.size = RandomFloat(0.5, 1.0);
        this.hit=false;
        this.energia=100;
        this.is_pain=false;
        this.timer_pain=0;
    }

    ready()
    {
        this.player = this.gameObject.scene.Find('Player');
        this.gameObject.AddComponent(new Sprite(Game.GetImage('ufo')));
        this.gameObject.AddComponent(new Collider(new  RectMask(80,80,40,40),ENEMY_GROUP, BULLET_ENEMY_MASK | PLAYER_MASK));
        this.gameObject.CenterBySprite();
        this.sprite = this.gameObject.GetComponent('Sprite');

    }
    OnCollisionEnter(other)
    {
        this.hit=true;
        this.is_paint=true;
        this.energia-=25;
        this.timer_pain=millis();
        
    }


    update(dt)
    {
        if (this.energia<=0)
        {
            this.gameObject.Destroy();
        }
        if (millis()-this.timer_pain>100)
        {
            this.hit=false;
        }

        if (this.hit)
        {
           
             this.sprite.red=255;
             this.sprite.green=0;
             this.sprite.blue=0;
        } else 
        {
            this.sprite.red=255;
            this.sprite.green=255;
            this.sprite.blue=255;
        }

        this.animation += dt * 0.1;
        let pump = PingPong(this.animation,0.3);

        this.gameObject.transform.scale.x = this.size + pump;
        this.gameObject.transform.scale.y = this.size + pump;

        let player_pos = this.player.transform.position;
        let distance = Vector2.Distance(this.gameObject.transform.position, player_pos);
        let angle = GetAngle(this.gameObject.transform.position.x, this.gameObject.transform.position.y, player_pos.x, player_pos.y);
        this.gameObject.transform.rotation+=this.speedTorque*dt;
        if (distance > 20)
        {
            this.gameObject.transform.movex(this.speed * dt, angle);
        }
    }
    post_render()
    {

        let w =  this.sprite.width  * this.gameObject.transform.scale.x;
        let h = (this.sprite.height/2) * this.gameObject.transform.scale.y;
        let fill_width = (w * this.energia) / 100; 
        if (this.hit)
        {
            fill(255,255,255);
            rect((this.gameObject.transform.position.x-w/2),(this.gameObject.transform.position.y+h), w,10);
            if (this.energia<50)
            {
                fill(255,0,0);

            } else 
            if (this.energia>=50 && this.energia<75)
            {
                fill(255,255,0);
            } else 
            {
                fill(0,255,0);
            }

            rect((this.gameObject.transform.position.x-w/2),(this.gameObject.transform.position.y+h), fill_width,10);
          
        }
           
    
    }
}



class Kickback extends Component 
{
    constructor() 
    {
        super('Kickback');
        this.recoil=0;
        this.y=0;
      
    }

    ready()
    {
        this.y = this.gameObject.transform.position.y;
    }


    update(dt) 
    {
        
        this.recoil = Max(0, this.recoil - 1);
        this.gameObject.transform.position.y = this.y - LengthDirY(this.recoil, 90.0);
                 
    }
 
    start() 
    {
       this.recoil = 8;
    }
}

class BulletScript extends ScriptComponent
{
    constructor(x,y,angle)
    {
        super();
        this.speed = 80;
        this.acceleration = 0.1;
        this.x = x;
        this.y = y;
        this.angle = angle; 
    }

    OnCollisionEnter(other)
    {
         this.gameObject.Destroy();
    }

    ready()
    {

        this.gameObject.transform.position.x = this.x;
        this.gameObject.transform.position.y = this.y;
        this.gameObject.transform.rotation = this.angle -90;
        this.gameObject.AddComponent(new Deletor(10));
        this.gameObject.AddComponent(new Sprite(Game.GetImage('bullet_orange')));
        this.gameObject.AddComponent(new Collider(new CircleMask(10,0,0),PLAYER_GROUP,BULLET_PLAYER_MASK));

        let action1 = new TweenProperty(this.gameObject.transform.scale, 'x', 0.1, 2, 2, Ease.Linear);
        action1.start();
        action1.OnComplete = () =>
        {
            action1.remove();
        }
        let action2 = new TweenProperty(this.gameObject.transform.scale, 'y', 0.1, 2, 2, Ease.Linear);
        action2.start();
        action2.OnComplete = () =>
        {
            action2.remove();
        }

        this.gameObject.CenterBySprite();
    }

    update(dt)
    {
        this.acceleration = this.speed * dt;
        this.gameObject.transform.movex(this.acceleration , this.angle);
    }

}


class MainScene extends Scene
{

    createEnemy()
    {
        let enemy = new GameObject('Enemy');
        let side = RandomInt(0,4);
        if (side == 0)
        {
            enemy.transform.position.x = 0;
            enemy.transform.position.y = 0;
        } else 
        if (side == 1)
        {
            enemy.transform.position.x = Width;
            enemy.transform.position.y = 0;
        } else
        if (side == 2)
        {
            enemy.transform.position.x = Width;
            enemy.transform.position.y = Height;
        } else
        if (side == 3)
        {
            enemy.transform.position.x = 0;
            enemy.transform.position.y = Height;
        } else 
        {
            enemy.transform.position.x = 0;
            enemy.transform.position.y = 0;
        }


        enemy.AddComponent(new EnemyScript());

        this.Add(enemy);
    }
    ready()
    {
        console.log('MainScene Ready');

        this.bulleteTime = 0;
        this.bulletInterval = 0.1;
        this.side = 0;

        this.enemyTime = 0;
        this.enemyInterval = 2;
       
        let player = new GameObject('Player');
        player.transform.position.x = Width/2;
        player.transform.position.y = Height/2;
        player.bound.set(0,0,99, 75);

   
        player.AddComponent(new PlayerScript());
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
        
        this.createEnemy();

      
        
    }
    update(dt)
    {

        if (millis() - this.enemyTime > this.enemyInterval * 1000)
        {
            this.enemyTime = millis();
            this.createEnemy();
        }
    

       let pointA = this.rightCano.GetWorldPoint(6,-6);
       let pointB = this.leftCano.GetWorldPoint(6,-6);
       let point = this.gamePlayer.GetWorldPoint(50,-10);
       let angle = this.gamePlayer.transform.rotation ;
       let in_angle =  GetAngle(point.x, point.y,  mouseX, mouseY) - 90;
       let angleDifference = IsWithinAngleRange(angle, in_angle, 40);

     

        // noStroke();
        // fill("red");
        //  circle(pointA.x, pointA.y, 5);
        //  circle(pointB.x, pointB.y, 5);
        // circle(point.x, point.y, 5);

    //     text(`${int(angleDifference)} ${int(angle)} ${int(in_angle)} `, 220, 70);
        if (mouseIsPressed ) 
        {
            this.gamePlayer.GetComponent('Script').moveTo(mouseX, mouseY);
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
        this.Collisions();


        
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

