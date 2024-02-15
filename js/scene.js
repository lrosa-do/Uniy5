"use strict";

class Action 
{
    constructor(tag)
    {
        this.tag = tag;
        this.done=false;
        this.finished = false;
        this.elapsed = 0;
        this.play=false;
        this.OnStart =  function() {};
        this.OnProgress = function(dt) {};
        this.OnComplete =  function() {};
        Game.AddAction(this);
    }
    update(dt)
    {
       
    }
    start()
    {
        
    }
    stop()
    {
        
    }
    remove()
    {
        this.done=true;
    }
}



class Tween extends Action
{
    constructor(startValue,endValue,duration,ease) 
    {
      super('Tween');
      this.startValue = startValue;
      this.endValue = endValue;
      this.duration = duration || 1000; // Default duration of 1 second
      this.easingFunction = ease || Ease.Linear;
    }
  
    start() 
    {
      this.elapsed = 0;
      this.finished = false;
      this.play=true;
      this.OnStart();
      return this;
    }
  
    update(deltaTime) 
    {
        
      if (this.finished || this.done || !this.play) return;
  
      this.elapsed += deltaTime;
  
      const progress = Math.min(this.elapsed / this.duration, 1); 
  
      const easedProgress = this.easingFunction(progress);
      const interpolatedValue = this.startValue + (this.endValue - this.startValue) * easedProgress;
  
      this.OnProgress(interpolatedValue);
   
      if (progress >= 1) 
      {
        this.finished = true;
        this.OnComplete();
        this.play=false;
      }
    }
  
  }
  

class TweenProperty extends Action
{
    constructor(Object,propertys,startValue,endValue,duration,ease) 
    {
      super('TweenProperty');
      this.object = Object;
      this.propertys = propertys;
      this.startValue = startValue;
      this.endValue = endValue;
      this.duration = duration || 1000; // Default duration of 1 second
      this.easingFunction = ease || Ease.Linear;
    }
  
    start() 
    {
      this.elapsed = 0;
      this.finished = false;
      this.play=true;
      this.OnStart();
      return this;
    }
  
    update(deltaTime) 
    {
        
      if (this.finished || this.done || !this.play) return;
  
      this.elapsed += deltaTime;
  
      const progress = Math.min(this.elapsed / this.duration, 1); 
  
      const easedProgress = this.easingFunction(progress);
      const interpolatedValue = this.startValue + (this.endValue - this.startValue) * easedProgress;
  
      this.OnProgress(interpolatedValue);
      if (this.object!=null)
      {
           for (let i=0; i<this.propertys.length; i++)
           {
                let property = this.propertys[i];

                if (this.object.hasOwnProperty(property))
                {
                    this.object[property]=interpolatedValue;
                }
           }
      }
  
      if (progress >= 1) 
      {
        this.finished = true;
        this.OnComplete();
        this.play=false;
      }
    }
  
  }


class Component
{
    constructor(type)
    {
        this.type = type;
        this.gameObject = null;
        this.is_ready = false;
    }

    ready()
    {

    }
    
    update(dt)
    {

    }

    process()
    {

    }

    render()
    {

    }
    post_render()
    {

    }
}

class Deletor extends Component
{
    constructor(time)
    {
        super('Deletor');
        this.time = time || 1;
        
    }

   update(dt)
    {
         this.time -= dt;
         if (this.time <= 0)
         {
              this.gameObject.is_done = true;
         }
    }

}

class ShapeRect extends Component
{
    constructor(width, height, solid, color, off_x, off_y)
    {
        super('ShapeRect');
        this.solid = solid || false;
        this.color = color || 'white';
        this.width = width;
        this.height = height;       
        this.off_x = off_x || 0;
        this.off_y = off_y || 0;

    }

    render()
    {
  
        if (this.solid)
        {
            fill(this.color);
           

        } else 
        {
            noFill();
            stroke(this.color);
        }
        rect(this.off_x, this.off_y, this.width, this.height);
    }
   

}

class ShapeCircle extends Component 
{
    constructor(radius, solid, color, off_x, off_y)
    {
        super('ShapeCircle');
        this.solid = solid || false;
        this.color = color || 'white';
        this.radius = radius;
        this.off_x = off_x || 0;
        this.off_y = off_y || 0;
    }

    render()
    {
        if (this.solid)
        {
            noStroke();
            fill(this.color);
        }
        else
        {
            noFill();
            stroke(this.color);
        }
        circle(this.off_x, this.off_y, this.radius);
    }
}

class Sprite extends Component
{
    constructor(image, off_x, off_y)
    {
        super('Sprite');
        this.image = image;
        this.off_x = off_x || 0;
        this.off_y = off_y || 0;
        this.clip = new Bound(0,0,1,1);
        this.useClip = false;
        this.red=255;
        this.green=255;
        this.blue=255;
        this.width= image.width;
        this.height= image.height;
    }

    SetOffSet(x, y)
    {
        this.off_x = x;
        this.off_y = y;
    }

    SetClip(x, y, width, height)
    {
        this.clip.set(x, y, width, height);
        this.width = width;
        this.height = height;
        this.useClip = true;
    }

    render()
    {
        tint(this.red, this.green, this.blue);
        if (this.useClip)
        {
            image(this.image, this.off_x, this.off_y, this.clip.width, this.clip.height, 
            this.clip.x, this.clip.y, this.clip.width, this.clip.height);
        } else 
        {
            image(this.image, this.off_x, this.off_y);
        }
       
    }
}

class Mask 
{
    constructor(type,off_x,off_y)
    {
        this.type=type;
        this.off_x = off_x || 0;
        this.off_y = off_y || 0;
     
    }
}

class CircleMask extends Mask
{
    constructor(radius,off_x,off_y)
    {
        super('Circle',off_x,off_y);
        this.radius = radius;

    }
}

class RectMask extends Mask
{
    constructor(width, height,off_x,off_y)
    {
        super('Rect',off_x,off_y);
        this.width = width;
        this.height = height;
    }
}


function same_group_and_mask(group, mask, other)
{
    return (group & other.group) > 0 && (mask & other.id_mask) > 0;
}

class Collider extends Component
{
    constructor(mask, group, id_mask)
    {
        super('Collider');
        this.mask=mask;
        this.pivot = new Vector2(0,0);
        this.group =  group || 1;
        this.id_mask= id_mask || 1;
        this.is_trigger = false;

    }

    ready()
    {
        this.gameObject.collide =true;
    }
    // render()
    // {
    //     noFill();
    //     stroke("red");
    //     if (this.mask.type === 'Circle')
    //     {
    //         circle(this.mask.off_x, this.mask.off_y, this.mask.radius*2);
    //         circle(this.pivot.x, this.pivot.y, this.mask.radius*2);
    //     } else 
    //     if (this.mask.type === 'Rect')
    //     {
    //         rect(this.mask.off_x, this.mask.off_y, this.mask.width, this.mask.height);
    //         rect(this.pivot.x, this.pivot.y, this.mask.width, this.mask.height);
    //     }
    // }


    getPivot()
    {
        //this.pivot = this.gameObject.matrix.set_pointTransform(this.mask.off_x, this.mask.off_y, this.mask.pivot);
        this.pivot.x = -this.mask.off_x + this.gameObject.transform.position.x;
        this.pivot.y = -this.mask.off_y + this.gameObject.transform.position.y;
        return this.pivot;
    }


 
    collide(other)
    {
        if (!same_group_and_mask(this.group, this.id_mask, other))
        {
        let pointA = this.getPivot();
        let pointB = other.getPivot();
        let x = pointA.x;
        let y = pointA.y;
        let other_x = pointB.x;
        let other_y = pointB.y;
       

            if (this.mask.type === 'Circle')
            {
                if (other.mask.type === 'Circle')
                {
                    return CircleInCircle(x, y, this.mask.radius, other_x, other_y, other.mask.radius);
                }
                if (other.mask.type === 'Rect')
                {
                    return CircleInRect(x, y, this.mask.radius, other_x, other_y, other.mask.width, other.mask.height);
                }
            } else
            if (this.mask.type === 'Rect')
            {
                if (other.mask.type === 'Circle')
                {
                    return CircleInRect(other_x, other_y, other.mask.radius, x, y, this.mask.width, this.mask.height);
                }
                if (other.mask.type === 'Rect')
                {
                    return RectInRect(x, y, this.mask.width, this.mask.height, other_x, other_y, other.mask.width, other.mask.height);
                }
            }
        }

        return false;
    
    }
    collidet_at(x,y,other)
    {
        let other_x = other.gameObject.transform.position.x;
        let other_y = other.gameObject.transform.position.y;
        if (this.mask.type === 'Circle')
        {
            if (other.mask.type === 'Circle')
            {
                return CircleInCircle(x, y, this.mask.radius, other_x, other_y, other.mask.radius);
            }
            if (other.mask.type === 'Rect')
            {
                return CircleInRect(x, y, this.mask.radius, other_x, other_y, other.mask.width, other.mask.height);
            }
        } else 
        if (this.mask.type === 'Rect')
        {
            if (other.mask.type === 'Circle')
            {
                return CircleInRect(other_x, other_y, other.mask.radius, x, y, this.mask.width, this.mask.height);
            }
            if (other.mask.type === 'Rect')
            {
                return RectInRect(x, y, this.mask.width, this.mask.height, other_x, other_y, other.mask.width, other.mask.height);
            }
        }
    }
}

class Transform extends Component
{
	constructor()
	{
        super('Transform');
		this.position = new Vector2(0,0);
		this.scale    = new Vector2(1, 1);
		this.rotation = 0;
		this.skew     = new Vector2(0,0);
		this.pivot    = new Vector2(0,0);
		this.matrix   = new Matrix2D();
		this.update(0);

	}
	getTransform()
	{
		
			if (this.skew.x === 0 || this.skew.y === 0)
			{
				if (this.rotation==0)
				{
					this.matrix.set(
						this.scale.x, 
						0, 
						0, 
						this.scale.y, 
						this.position.x - this.pivot.x * this.scale.x, 
						this.position.y - this.pivot.y * this.scale.y);
				} else 
				{
					let spin = RAD(this.rotation);
					let cos = Math.cos(spin);
					let sin = Math.sin(spin);
					let a = this.scale.x * cos;
					let b = this.scale.x * sin;
					let c = this.scale.y * -sin;
					let d = this.scale.y * cos;
					let tx = this.position.x - this.pivot.x * a - this.pivot.y * c;
					let ty = this.position.y - this.pivot.x * b - this.pivot.y * d;
					this.matrix.set(a, b, c, d, tx, ty);
				}
			} else 
			{
			this.matrix.identity();
			this.matrix.translate(this.position.x, this.position.y);
			let spin = RAD(this.rotation);
			this.matrix.rotate(spin);
			this.matrix.scale(this.scale.x, this.scale.y);
			this.matrix.skew(this.skew.x, this.skew.y);
			this.matrix.translate(-this.origin.x, -this.origin.y);
            }
		return this.matrix;
	}

    move(speed)
    {
        this.position.x += speed * Math.cos( RAD(this.rotation));
        this.position.y += speed * Math.sin( RAD(this.rotation));
    
    }

    movex(speed,angle)
    {
        this.position.x += speed * Math.cos(RAD(angle));
        this.position.y += speed * Math.sin(RAD(angle));

    }

    //LERP TO POINT
    rotate_to_point(x, y, speed, off_set)
    {
         let add_angle = off_set || 0;
         let to_speed = speed || 1;
          this.rotation = LerpAngleDegrees(this.rotation, GetAngle(this.position.x,this.position.y,  x,y) + add_angle, to_speed);
    }
    pointToMouse(speed, off_set)
    {
        let add_angle = off_set || 0;
        let to_speed = speed || 1;
        this.rotation = LerpAngleDegrees(this.rotation, GetAngle(this.position.x,this.position.y,  mouseX, mouseY) + add_angle, to_speed);
    }
	
}

class ScriptComponent extends Component
{
    constructor()
    {
        super('Script');
    }
    OnCollisionEnter(other)
    {

    }
    OnCollisionExit(other)
    {

    }
}



class GameObject 
{
    constructor(name)
    {   
        this.tag = '';
        this.name = name;
        this.is_done = false;
        this.collide = false;
        this.visible = true;
        this.active = true;
        this.parent = null;
       
        this.bound = new Bound(0,0,1,1);
        this.worldBound = new Bound(0,0,1,1);
        this.components={};
        this.componentsList=[]; 
        this.children=[];
        this.transform = new Transform();
        this.matrix = this.transform.getTransform();
        this.debug = false;
        this.scene = null;
        this.is_ready =false;
    }

    ready()
    {

    }
    
    done()
    {

    }
   

    GetWorldPoint(x,y)
    {
        if (this.parent)
        {
            
            let world = Matrix2D.Multiply(this.GetTransform(), this.parent.GetTransform());
            return world.transformPoint(x,y);
        }
        else
        {
            return this.GetTransform().transformPoint(x,y);
        }
    }

    GetLocalPoint(v)
    {
        return this.GetTransform().transformPoint(x,y);
    }    
    GetTransform()
    {
        return this.transform.getTransform();
    }
    Add(child)
    {
        this.children.push(child);
        child.scene = this.scene;
        child.parent = this;
    }

    Remove(child)
    {
        let index = this.children.indexOf(child);
        if (index > -1)
        {
            this.children.splice(index, 1);
            child.parent = null;
        }
    }
    Find(name)
    {
        for (let child of this.children)
        {
            if (child.name === name)
                return child;
        }
        return null;
    }
    CenterPivot()
    {
        this.transform.pivot.x = this.bound.width * 0.5;
        this.transform.pivot.y = this.bound.height * 0.5;
    }
    CenterBySprite()
    {
        let sprite = this.GetComponent('Sprite');
        if (sprite)
        {
            this.bound.width  = sprite.image.width;
            this.bound.height = sprite.image.height;
            ///console.log(this.bound.width + ' ' + this.bound.height);
            this.CenterPivot();
        }
    }


    AddComponent(component)
    {
        this.components[component.type] = component;
        component.gameObject = this;
        this.componentsList.push(component);
    }

    GetComponent(type)
    {
        return this.components[type];
    }

    ContainsComponent(type)
    {
        return this.components[type] != null;
    }



    update(dt)
    {
        for (let i in this.components)
        {
            if (!this.components[i].is_ready)
            {
                this.components[i].ready();
                this.components[i].is_ready = true;
            }
            this.components[i].update(dt);
        }

        this.matrix = this.transform.getTransform();
        for (let child of this.children)
        {
            child.update(dt);
        }
    }

    process()
    {
        for (let child of this.children)
        {
            child.process();
        }
        for (let i in this.components)
        {
            this.components[i].process();
        }

    }



    render()
    {
        
       push();
        
      // this.transform.rotation += 1;
        let matrix = this.matrix;// this.transform.getTransform();
        this.worldBound = matrix.transformBoundTo(this.bound, this.worldBound);

        applyMatrix(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
      //  context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
    
      
        
        for (let i in this.components)
        {
        
                this.components[i].render();
        }
        
        for (let child of this.children)
        {
            child.render();
        }

        if (this.debug)
        {
            noFill();
            stroke("red");
            circle(this.transform.pivot.x,this.transform.pivot.y,8);
            rect(this.bound.x, this.bound.y, this.bound.width, this.bound.height);
        }
        pop();
       
        for (let i in this.components)
        {
            this.components[i].post_render();
        }

        if (this.debug)
        {
       
            noFill();
            stroke("blue");
            rect(this.worldBound.x, this.worldBound.y, this.worldBound.width, this.worldBound.height);
        }

       
    }
    Destroy()
    {
        this.is_done = true;
    }
}

class Scene
{
    constructor()
    {
        this.name = '';
        this.gameObjects = [];
        this.removeList = [];
        this.queueList = [];
    }

    Add(gameObject)
    {
      
        this.queueList.push(gameObject);
    }

    Remove(gameObject)
    {
        gameObject.scene = null;
        this.removeList.push(gameObject);
    }

    Count()
    {
        return this.gameObjects.length;
    }
    Find (name)
    {
        for (let gameObject of this.gameObjects)
        {
            if (gameObject.name === name)
                return gameObject;
        }
        return null;
    }

    ready()
    {

    }
    
    done()
    {

    }

    update(dt)
    {

    }

    process()
    {

    }

    render()
    {

    }

    Collisions()
    {
        for (let i = 0; i < this.gameObjects.length - 1; i++)
        {
            for (let j = i + 1; j < this.gameObjects.length; j++)
            {
                if (this.gameObjects[i].collide && this.gameObjects[j].collide)
                {
                    let ColliderA = this.gameObjects[i].GetComponent('Collider');
                    let ColliderB = this.gameObjects[j].GetComponent('Collider');
                    if (this.gameObjects[i] === this.gameObjects[j]) continue;
                    if (ColliderA && ColliderB)
                    {
                        if (ColliderA.collide(ColliderB))
                        {
                            if (ColliderA.gameObject.ContainsComponent('Script'))
                            {
                                let component = ColliderA.gameObject.GetComponent('Script');
                                component.OnCollisionEnter(ColliderB.gameObject);
                            }
                            if (ColliderB.gameObject.ContainsComponent('Script'))
                            {
                                let component = ColliderB.gameObject.GetComponent('Script');
                                component.OnCollisionEnter(ColliderA.gameObject);
                            }
                        } else 
                        {
                            if (ColliderA.gameObject.ContainsComponent('Script'))
                            {
                                let component = ColliderA.gameObject.GetComponent('Script');
                                component.OnCollisionExit(ColliderB.gameObject);
                            }
                            if (ColliderB.gameObject.ContainsComponent('Script'))
                            {
                                let component = ColliderB.gameObject.GetComponent('Script');
                                component.OnCollisionExit(ColliderA.gameObject);
                            }
                        }
                            
                    }
                }
            }
        }
    }

    OnUpdate(dt)
    {

        for (let gameObject of this.queueList)
        {
            gameObject.scene = this;
            gameObject.ready();
            this.gameObjects.push(gameObject);
        }
        this.queueList = [];

        for (let i=0; i<this.gameObjects.length; i++)
        {
            let gameObject = this.gameObjects[i];
            if (gameObject.is_done)
            {
                this.removeList.push(gameObject);
                this.gameObjects.splice(i, 1);
                continue;
            }
            if (gameObject.active)
                gameObject.update(dt);
        }

        for (let i=0; i<this.removeList.length; i++)
        {
            let gameObject = this.removeList[i];
            gameObject.done();
            this.removeList.splice(i, 1);
        }
       this.removeList=[];
       this.update(dt);
    }

    OnProcess()
    {
        for (let gameObject of this.gameObjects)
        {
            if (gameObject.active)
                gameObject.process();
        }
        this.process();
    }

    OnRender()
    {
   
        push();
        for (let gameObject of this.gameObjects)
        {
            if (gameObject.visible)
                gameObject.render();
        }
        this.render();
        pop();
       
             
    }

    OnResize (width, height)
    {
     
    }
}


class Game 
{
    static isRunning = false;
    static currentScene = null;
    static scenes = {};
    static images = {};
    static imagesList = [];
    static actions = [];


    static Init()
    {   
      
    } 

    static LoadImage(path,name)
    {
        let id = name || path; 
        let img = loadImage(path);
        Game.images[id]    = img;
        Game.imagesList.push(img);
        return Game.imagesList.length-1;
    }

    static GetImage(name)
    {
        return Game.images[name];
    }

    static GetImageCount()
    {
        return Game.imagesList.length;
    }

    static GetImageIndex(index)
    {
        return Game.imagesList[index];
    }

    static Start()
    {
        Game.isRunning = true;

    }

    static AddAction(action)
    {
        Game.actions.push(action);
    }

    static Update(dt)
    {
        if (!Game.isRunning)
            return;
        if (Game.currentScene)
            Game.currentScene.OnUpdate(dt);
        for (let i = 0; i < Game.actions.length; i++)
        {
            if (Game.actions[i].done)
            {
                Game.actions.splice(i, 1);
                continue;
            }
            Game.actions[i].update(dt);
        }
    }

    static Process()
    {
        if (!Game.isRunning)
            return;
        if (Game.currentScene)
            Game.currentScene.OnProcess();
    }

    static Render()
    {
        if (!Game.isRunning)
            return;
 
        
        if (Game.currentScene)
            Game.currentScene.OnRender();
    }

    static ChangeScene(name)
    {
        if (!Game.scenes[name])
            return;
        if (Game.currentScene)
        {
            Game.currentScene.done();
        }
        Game.currentScene = Game.scenes[name];
        Game.currentScene.ready();
    }

    static AddScene(scene, name)
    {
        scene.name = name;
        Game.scenes[name] = scene;
    }
   
    static RemoveScene(name)
    {
        delete Game.scenes[name];
    }

    static SceneFindGameObject(name)
    {
       if (Game.currentScene)
       {
           return Game.currentScene.Find(name);
       }
         return null;
    }

    static GetScene(name)
    {
        return Game.scenes[name];
    }

    static GetSceneNames()
    {
        return Object.keys(Game.scenes);
    }

    static GetSceneCount()
    {
        return Object.keys(Game.scenes).length;
    }
    static Resize(width, height)
    {
       if (Game.currentScene)
       {
        Game.currentScene.OnResize(width, height);
       }
    }

    static DrawImage(img, x, y)
    {
       // image(img, x, y);
    }
    static DrawImagePart(img, x, y, bound)
    {
       
       // image(img, 0, 0, w, h, w, 0, w, h);
        image(img, x,y, bound.width, bound.height, bound.x, bound.y, bound.width, bound.height);

        //image(img, dx, dy, dWidth, dHeight, sx, sy, [sWidth], [sHeight], [fit], [xAlign], [yAlign])

    }

}