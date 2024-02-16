"use strict";


const GROUP_PLAYER          = Math.pow(2,0);
const GROUP_BULLET_PLAYER   = Math.pow(2,1);
const GROUP_BULLET_ENEMY    = Math.pow(2,2);
const GROUP_ENEMY           = Math.pow(2,3);

const MASK_PLAYER = GROUP_BULLET_ENEMY | GROUP_ENEMY;
const MASK_BULLET_PLAYER = GROUP_ENEMY;
const MASK_BULLET_ENEMY = GROUP_PLAYER;
const MASK_ENEMY = GROUP_PLAYER | GROUP_BULLET_PLAYER;
const MASK_ALL = GROUP_PLAYER | GROUP_BULLET_PLAYER | GROUP_BULLET_ENEMY | GROUP_ENEMY;



const explosion_frames = Bound.CreateAtlasFrames(1024,1024, 5, 5);


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
        this.gameObject.AddComponent(new Collider(new CircleMask(50,50,50),GROUP_PLAYER, MASK_PLAYER));
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
        this.sprite = new Sprite(Game.GetImage('ufo'));
        this.gameObject.AddComponent(this.sprite);
        this.gameObject.AddComponent(new Collider(new CircleMask(50,50,50), GROUP_ENEMY, MASK_ENEMY ));
        this.gameObject.CenterBySprite();
       

    }
    OnCollision(other)
    {
        this.hit=true;
        this.is_paint=true;
        this.energia-=25;
        this.timer_pain=millis();
        
    }

    done()
    {
        let image =  Game.GetImage('explosion');
        let x = this.gameObject.transform.position.x-40  * this.size;
        let y = this.gameObject.transform.position.y-40  * this.size;
        let anim = new AnimationAction(x,y,90* this.size , 90 * this.size,image,explosion_frames, 25,false);
        anim.start();
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
       //  this.gameObject.Destroy();
     //  console.log('BulletScript OnCollisionEnter');
    }

    OnCollisionExit(other)
    {
       
      //  console.log('BulletScript OnCollisionExit');
      // 
    }

    OnCollision(other)
    {
      //  this.gameObject.Destroy();
      //  this.gameObject.Destroy();
      //  console.log('BulletScript OnCollision');
        this.gameObject.Destroy();
    }
    ready()
    {

        this.gameObject.transform.position.x = this.x;
        this.gameObject.transform.position.y = this.y;
        this.gameObject.transform.rotation = this.angle -90;
        this.gameObject.AddComponent(new Deletor(10));
        this.gameObject.AddComponent(new Sprite(Game.GetImage('bullet_orange')));
        this.gameObject.AddComponent(new Collider(new RectMask(8,30,0,0),GROUP_BULLET_PLAYER, MASK_BULLET_PLAYER));

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

        // this.polyA=new Polygon();
        // this.polyA.setBox(25, 25,50,50);

        // this.polyB=new Polygon();
        // this.polyB.setCircle(50, 50, 50,8);

       

      
        
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



/*


const GROUP_PLAYER          = Math.pow(2,0);
const GROUP_BULLET_PLAYER   = Math.pow(2,1);
const GROUP_BULLET_ENEMY    = Math.pow(2,2);
const GROUP_ENEMY           = Math.pow(2,3);

const MASK_PLAYER = GROUP_BULLET_ENEMY | GROUP_ENEMY;
const MASK_BULLET_PLAYER = GROUP_ENEMY;
const MASK_BULLET_ENEMY = GROUP_PLAYER;
const MASK_ENEMY = GROUP_PLAYER | GROUP_BULLET_PLAYER;
const MASK_ALL = GROUP_PLAYER | GROUP_BULLET_PLAYER | GROUP_BULLET_ENEMY | GROUP_ENEMY;
*/

const  PLAYER = Math.pow(2,0);
const  ENEMY =  Math.pow(2,1);

class Bunny extends ScriptComponent
{
    constructor()
    {
        super();
        this.speed = new Vector2(RandomFloat(2,8),RandomFloat(5,8));
        this.hit=false;
        this.last_x=0;
        this.last_y=0;
        
    
    }

    ready()
    {

  

        
        this.sprite =new Sprite(Game.GetImage('wabbit'));
        this.gameObject.AddComponent(this.sprite);
        this.width =  this.sprite.width;
        this.height = this.sprite.height;

      ///  this.gameObject.transform.position.x = 25 + this.width;
       // this.gameObject.transform.position.y = 25 + this.height ;

    this.gameObject.AddComponent(new Collider(new RectMask(this.width,this.height,0,0),PLAYER, ENEMY  ));
        this.gameObject.CenterBySprite();

    }

    OnCollisionEnter(other)
    {
   //  console.log('Bunny OnCollisionEnter');  
     this.hit=true; 
     this.last_x = this.gameObject.transform.position.x;
     this.last_y = this.gameObject.transform.position.y;
     this.sprite.red=255;
     this.sprite.green=0;
     this.sprite.blue=0;

    }

    OnCollisionExit(other)
    {
       this.hit=false;
       this.sprite.red=255;
              this.sprite.green=255;
              this.sprite.blue=255;

      // console.log('Bunny OnCollisionExit');
      // this.gameObject.transform.position.x = this.last_x;
     //  this.gameObject.transform.position.y = this.last_y;
        // this.speed.x *= -1;
        // this.speed.y *= -1;
    }
    
    OnCollision(other)
    {
      //  console.log('Bunny OnCollision');
        
    
    }
    render()
    {

    //     if (this.hit)
    //     {
    //        this.sprite.red=255;
    //        this.sprite.green=0;
    //        this.sprite.blue=0;
    //        }
    //    else
    //    {
    //        this.sprite.red=255;
    //        this.sprite.green=255;
    //        this.sprite.blue=255;
    //    }
    }

    update(dt)
    {

    
        
        if (this.gameObject.transform.position.x > Width - this.width || this.gameObject.transform.position.x < 0)
        {
            this.speed.x *= -1;
        }

        if (this.gameObject.transform.position.y > Height - this.height || this.gameObject.transform.position.y < 0)
        {
            this.speed.y *= -1;
        }

        this.gameObject.transform.position.x += this.speed.x;
        this.gameObject.transform.position.y += this.speed.y;

      
    }
}


class Zaka extends ScriptComponent
{
    constructor()
    {
        super();
      
        
    
    }

    ready()
    {

  

        
        this.sprite =new Sprite(Game.GetImage('wabbit'));
        this.gameObject.AddComponent(this.sprite);
        this.width =  this.sprite.width;
        this.height = this.sprite.height;

      ///  this.gameObject.transform.position.x = 25 + this.width;
       // this.gameObject.transform.position.y = 25 + this.height ;

        this.gameObject.AddComponent(new Collider(new RectMask(this.width,this.height,0,0), ENEMY,  PLAYER));
        this.gameObject.CenterBySprite();

    }

    OnCollisionEnter(other)
    {
  
     this.sprite.red=255;
     this.sprite.green=0;
     this.sprite.blue=0;
    // console.log('Zaka OnCollisionEnter');

    }

    OnCollisionExit(other)
    {
      
             this.sprite.red=255;
              this.sprite.green=255;
              this.sprite.blue=255;
            //  console.log('Zaka OnCollisionExit');

    }
    
    OnCollision(other)
    {
      //  console.log('Bunny OnCollision');
     // console.log('Zaka OnCollision');
        
    
    }
    render()
    {

    }

    update(dt)
    {

    
      
      
    }
}

class CollideScene extends Scene
{


    AddBunny(x,y)
    {
        let bunny = new GameObject("Bunny");
        bunny.transform.position.x = x || RandomInt(0,Width);
        bunny.transform.position.y = y || RandomInt(0,Height);
        bunny.AddComponent(new Bunny());
        this.Add(bunny);
    }
    AddZaka(x,y)
    {
        let zaka = new GameObject("Zaka");
        zaka.transform.position.x = x ;
        zaka.transform.position.y = y ;
        zaka.AddComponent(new Zaka());
        this.Add(zaka);
        return zaka;
    }
    ready()
    {
       
        this.totalTime=0.0;
        let count = 20;
        for (let i=0; i<count; i++)
        {
            for (let j=0; j<count; j++)
            {
                this.AddZaka(10+i*50, 10+j*50);
            }
           
        }
      this.AddBunny();
        this.AddBunny();
      this.normalCollision= true;
      this.zaka_mouse = this.AddZaka(width/2,height/2);
      
    }

    update(dt)
    {
        if (mouseIsPressed)
        {
            this.zaka_mouse.transform.position.x = mouseX;
            this.zaka_mouse.transform.position.y = mouseY;
        }

        if (keyIsPressed)
        {
            this.normalCollision= !this.normalCollision;
        }

        let timeStart = performance.now();
        this.Collisions();
        this.totalTime = performance.now()-timeStart;
    }

    render()
    {
        
        fill(255);
        textSize(14);
        textAlign(LEFT, CENTER);
        let fps =int( frameRate());
        text(` ${fps}  ${this.totalTime} ${this.Count()}  ${ this.normalCollision} `, 20, 20);
    

        
    }
}