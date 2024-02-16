
"use strict";
const PI = 3.14159265;
const PI2 = 2*3.14159265;
const PI_2 = 3.14159265/2;
const PI_3 = 3.14159265/3;
const PI_4 = 3.14159265/4;


function RAD(d) { return -d*PI/180.0;}
function DEG(r) { return -r*180.0/PI;}

function RAD2DEG(radians) 
{
    return radians * (180 / PI);
}

function DEG2RAD(degrees) 
{
	return degrees * (PI / 180);
}

function Rand()
{
	return Math.floor(65536 * Math.random());
}

function RandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function RandomFloat(min, max)
{
	return Math.random() * (max - min) + min;
}

function Rand32()
{
	return rand()|(rand()<<16);
}

function Min(a,b)
{
	return Math.min(a,b);
}

function Max(a,b)
{
	return Math.max(a,b);
}
function Random()
{
	return Math.random();
}

function Abs(a) {return (a<0)?(-a):(a);}


function Length(x,y)
{
	return Math.sqrt(x*x+y*y);
}

function Distance(x1,y1,x2,y2)
{
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}


function DistanceQuad(x1,y1,x2,y2)
{
	return (x2-x1)*(x2-x1)+(y2-y1)*(y2-y1);
}

function IsWithinAngleRange(angle, targetAngle, range) 
{
    // Normaliza os ângulos para estar no intervalo de 0 a 360 graus
    angle = (angle + 360) % 360;
    targetAngle = (targetAngle + 360) % 360;

    // Calcula a diferença absoluta entre os ângulos
    let angleDifference = Math.abs(targetAngle - angle);

    // Verifica se a diferença de ângulo está dentro do range especificado
    return angleDifference <= range / 2;
}


function LineDist(ex1,ey1,ex2,ey2,x,y)
{
	let px = ex2-ex1;
	let py = ey2-ey1;
	let u = ((x - ex1) * px + (y - ey1) * py) / (px*px + py*py);
	if (u > 1)
		u = 1;
	else if (u < 0)
		u = 0;

	let dx = ex1 + u * px - x;
	let dy = ey1 + u * py - y;
	return Math.sqrt(dx*dx + dy*dy);
}

function Lerp(from,to,progress)
{
	return from+(to-from)*progress;
}



function Sign(a)
{
	return a < 0 ? -1 : (a > 0 ? 1 : 0);
}



function GetAngle(x1, y1, x2, y2) 
{
    // let angle = RAD2DEG(Math.atan2(y2 - y1, x2 - x1));
    // angle = (angle + 360) % 360; // Normaliza o ângulo para estar dentro do intervalo de 0 a 360 graus
    // return angle;

	let a = DEG(Math.atan2(y2 - y1, x2 - x1));
	//return a < 0 ? a + 360 : a;
	a = (a + 360) % 360; 
	return a;
}

function fGetAngle(x1,y1,x2,y2)
{
	
	let dx = x2 - x1 ;
	let dy = y2 - y1 ;
	let angle ;

	if (dx == 0.0) return dy > 0.0 ? 270.0 : 90.0 ;

	angle = (Math.atan(dy / dx) * 180.0 / PI) ;

	return dx > 0 ? -angle:-angle+180 ;
}
	

	



function Repeat(t, length)
{
	return Clamp(t - Math.floor(t / length) * length, 0.0, length);
}

function PingPong(t, length)
{
	t = Repeat(t, length * 2.0);
	return length - Abs(t - length);
}


function LengthDirX(len,dir)

{
	return len * Math.cos(RAD(dir));
}

function LengthDirY(len,dir)
{
	return len * Math.sin(RAD(dir));
}


function LerpAngleDegrees( a,  b,  lerpFactor) 
{
	let result;
    let diff = b - a;
    if (diff < -180)
    {
        // lerp upwards past 360
        b += 360;
        result = Lerp(a, b, lerpFactor);
        if (result >= 360)
        {
            result -= 360;
        }
    }
    else if (diff > 180)
    {
        // lerp downwards past 0
        b -= 360;
        result = Lerp(a, b, lerpFactor);
        if (result < 0)
        {
            result += 360;
        }
    }
    else
    {
        // straight lerp
        result = Lerp(a, b, lerpFactor);
    }

    return result;
}

function AngleDiff(a,b)
{
	let diff = b - a;
	diff /= 360; 
	diff = (diff - floor(diff))*360;
	if (diff > 180) { diff -= 360; }
	return diff;
}

function Clamp(value,min,max)
{
	if (max > min)
	{
		if (value < min) return min;
		else if (value > max) return max;
		else return value;
	} else {
		if (value < max) return max;
		else if (value > min) return min;
		else return value;
	}
}

function ClampAngle(angle) 
{
    return (angle % 360 + 360) % 360;
}


function Scale(value,min,max,min2,max2)
{
	return min2 + ((value - min) / (max - min)) * (max2 - min2);
}


function ScaleClamp(value,min,max,min2,max2)
{
	value = min2 + ((value - min) / (max - min)) * (max2 - min2);
	if (max2 > min2)
	{
		value = value < max2 ? value : max2;
		return value > min2 ? value : min2;
	}
	value = value < min2 ? value : min2;
	return value > max2 ? value : max2;
}

function Constrain(value, min, max)
{
	return Math.min(Math.max(value, min), max);
}

function PointInCircle(x,y,cx,cy,r)
{
	return (x-cx)*(x-cx)+(y-cy)*(y-cy)<r*r;
}

function PointInRect(x,y,rx,ry,rw,rh)
{
	return x>=rx && x<=rx+rw && y>=ry && y<=ry+rh;
}

function RectInRect(x,y,w,h,rx,ry,rw,rh)
{
	return x+w>=rx && x<=rx+rw && y+h>=ry && y<=ry+rh;
}

function CircleInCircle(x1,y1,r1,x2,y2,r2)
{
	return (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)<(r1+r2)*(r1+r2);
}

function CircleInRect(x,y,r,rx,ry,rw,rh)
{
	let testX=x;
	let testY=y;
	if (x<rx) testX=rx;
	else if (x>rx+rw) testX=rx+rw;
	if (y<ry) testY=ry;
	else if (y>ry+rh) testY=ry+rh;
	return Distance(x,y,testX,testY)<r;
}	





class Bound 
{
    constructor(x,y,w,h)
    {
        this.width=w;
        this.height=h;
        this.x=x;
        this.y=y;
    }
	contains(pointX, pointY) 
	{
        return (
            pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height
        );
    }

    intersects(otherBound)
	{
        return (
            this.x < otherBound.x + otherBound.width &&
            this.x + this.width > otherBound.x &&
            this.y < otherBound.y + otherBound.height &&
            this.y + this.height > otherBound.y
        );
    }
	set(x,y,w,h)
	{
		this.width=w;
		this.height=h;
		this.x=x;
		this.y=y;
	}
	addPoint(x,y)
	{
		if (x < this.x) this.x = x;
		if (y < this.y) this.y = y;
		if (x > this.x + this.width) this.width = x - this.x;
		if (y > this.y + this.height) this.height = y - this.y;
	}
	addVector(v)
	{
		if (v.x < this.x) this.x = v.x;
		if (v.y < this.y) this.y = v.y;
		if (v.x > this.x + this.width) this.width = v.x - this.x;
		if (v.y > this.y + this.height) this.height = v.y - this.y;
	}
	static CreateAtlasFrames(width,height, count_x,count_y)
	{
		let w = width /count_x;
		let h = height/count_y;
		let bounds = [];
		for (let y=0;y<count_y;y++)
		{
			for (let x=0;x<count_x;x++)
			{
				bounds.push(new Bound(x*w,y*h,w,h));
			}
		}
		return bounds;
	}
}

class Vector2 
{
    constructor(x, y) 
	{
        this.x = x || 0;
        this.y = y || 0;
    }

	set(x,y)
	{
		this.x = x;
		this.y = y;
		return this;
	}

	get()
	{
		return new Vector2(this.x,this.y);
	}

	
	heading()
	{
		return DEG( Math.atan2(this.y , this.x));
	}

	setMag( magnitude) 
	{
		return this.normalize().mult(n);
	}

	mult(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		return this;
	}

    add(v) 
	{
		this.x = this.x + v.x;
		this.y = this.y + v.y;
		return this;
    }

	sub(v) 
	{
		this.x = this.x - v.x;
		this.y = this.y - v.y;
		return this;
	}
	

    mult(n)
	{
		this.x = this.x * n;
		this.y = this.y * n;
		return this;
    }

	

    div(n) 
	{
		this.x = this.x / n;
		this.y = this.y / n;
		return this;
	}

    magnitude()
	{
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
	magnitudeSq()
	{
		return this.x * this.x + this.y * this.y;
	}

    normalize()
	 {
        let len = this.magnitude();
		if (len !== 0) this.mult(1 / len);
		return this;
    }
	limit(max)
	{
		
		if (this.magnitude() > max) 
		{
			this.normalize();
			this.mult(max);
		}

	}

    dot(vector) 
	{
        return this.x * vector.x + this.y * vector.y;
    }
	cross(vector)
	{
		return this.x * vector.y - this.y * vector.x;
	}

    clone() 
	{
        return new Vector2(this.x, this.y);
    }

	copy(vector)
	{
		this.x = vector.x;
		this.y = vector.y;
		return this;
	}
	angleBetween(v)
	{
		let dotmagmag = this.dot(v) / (this.mag() * v.mag());
		let angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
		return angle;
	}
	rotate (a)
	{
		let newHeading = this.heading() + a;
		let mag = this.magnitude();
		this.x = Math.cos(newHeading) * mag;
		this.y = Math.sin(newHeading) * mag;
		return this;
	}
	equals(v)
	{
		return this.x === v.x && this.y === v.y;
	}
	static Random2D()
	{
		return Vector2.fromAngle(Math.random() * PI2, 1);
	}
	static fromAngle(angle, length)
	{
		return new Vector2(length * Math.cos(angle), length * Math.sin(angle));
	
	}
	static Add(v1,v2)
	{
		return new Vector2(v1.x+v2.x,v1.y+v2.y);
	}

	static Mult(v1,n)
	{
		return new Vector2(v1.x*n,v1.y*n);
	}

	static Sub(v1,v2)
	{
		return new Vector2(v1.x-v2.x,v1.y-v2.y);
	}
	static Div(v1,n)
	{
		return new Vector2(v1.x/n,v1.y/n);
	}

	static Normalize(v)
	{
		let m = v.magnitude();
		if (m > 0) 
		{
			return new Vector2(v.x/m,v.y/m);
		}
		return new Vector2(0,0);
	}

	static Dot (v1,v2)
	{
		return v1.x*v2.x+v1.y*v2.y;
	}
	static Angle(v1,v2)
	{
		return Math.acos(Vector2.Dot(v1,v2)/(v1.magnitude()*v2.magnitude()));
	}
	static Distance(v1,v2)
	{
		return Math.sqrt((v2.x-v1.x)*(v2.x-v1.x)+(v2.y-v1.y)*(v2.y-v1.y));
	}
}


//returns the min and max projection values of a shape onto an axis
function projShapeOntoAxis(axis, vertex)
{
    let min = Vector2.Dot(axis, vertex[0]);
    let max = min;
    for(let i=0; i<vertex.length; i++)
    {
        let p = Vector2.Dot(axis, vertex[i]);
        if(p<min)
        {
            min = p;
        } 
        if(p>max)
        {
            max = p;
        }
    }
    return {
        min: min,
        max: max
    }
}

//applying the separating axis theorem on two objects
function SAT(a, b)
{
    let axes = [];
    for(let i=0; i<a.length; i++)
    {
        let j = (i+1)%a.length;
        let edge = Vector2.Sub(a[j], a[i]);
        axes.push(Vector2.Normalize(edge));
    }
    for(let i=0; i<b.length; i++)
    {
        let j = (i+1)%b.length;
        let edge = Vector2.Sub(b[j], b[i]);
        axes.push(Vector2.Normalize(edge));
    }
    for(let i=0; i<axes.length; i++)
    {
        let axis = axes[i];
        let p1 = projShapeOntoAxis(axis, a);
        let p2 = projShapeOntoAxis(axis, b);
        if(p1.max<p2.min || p1.min>p2.max)
        {
            return false;
        }
    }
    return true;
}

class Polygon
{
	constructor()
	{
		this.vertices = [];
		this.worldVertices = [];
		this.bounds = new Bound(0,0,0,0);
		this.worldBounds = new Bound(0,0,0,0);
	}
	setBox(x,y,w,h)
	{
		this.vertices.push(new Vector2(x,y));
		this.vertices.push(new Vector2(x+w,y));
		this.vertices.push(new Vector2(x+w,y+h));
		this.vertices.push(new Vector2(x,y+h));
		this.worldVertices.push(new Vector2(x,y));
		this.worldVertices.push(new Vector2(x+w,y));
		this.worldVertices.push(new Vector2(x+w,y+h));
		this.worldVertices.push(new Vector2(x,y+h));
		this.bounds.addVector(this.vertices[0]);
		this.bounds.addVector(this.vertices[1]);
		this.bounds.addVector(this.vertices[2]);
		this.bounds.addVector(this.vertices[3]);

	}
	setCircle(x,y,radius,segments)
	{
		let angle = PI2 / segments;
		for (let i=0;i<segments;i++)
		{
			let v = new Vector2(x+Math.cos(angle*i)*radius,y+Math.sin(angle*i)*radius);
			this.vertices.push(v);
			this.worldVertices.push(v);
			this.bounds.addVector(v);
		}
	}
	transform(mat)
	{
		mat.transformBoundRef(this.bounds, this.worldBounds);

		for (let i=0;i<this.vertices.length;i++)
		{
		
			 mat.transformVectorRef(this.vertices[i], this.worldVertices[i]);
		}
	}
	addPoint(x,y)
	{
		let v = new Vector2(x,y);
		this.vertices.push(v);
		this.worldVertices.push(v);
		this.bounds.addPoint(x,y);
	}

	render ()
	{
		//fill(255,0,255);
		for (let i=0;i<this.worldVertices.length;i++)
		{
			let next = i+1;
			if (next == this.worldVertices.length) next = 0;
			line(this.worldVertices[i].x,this.worldVertices[i].y,this.worldVertices[next].x,this.worldVertices[next].y);
		}
		//stroke(255,0,0);
		// for (let i=0;i<this.vertices.length;i++)
		// {
		// 	let next = i+1;
		// 	if (next == this.vertices.length) next = 0;
		// 	line(this.vertices[i].x,this.vertices[i].y,this.vertices[next].x,this.vertices[next].y);
		// }


	}
	collide(p)
	{
		if (this.worldBounds.intersects(p.worldBounds) )
		{
			return SAT(this.worldVertices,p.worldVertices);
		}
	//	return SAT(this.worldVertices,p.worldVertices);
		return false;
	}
}


function getPowIn(t,pow) 
{
		return Math.pow(t,pow);
}

function getPowOut(t,pow) 
{
	return 1-Math.pow(1-t,pow);
}

function getPowInOut(t,pow) 
{
	if ((t*=2)<1) return 0.5*Math.pow(t,pow);
		return 1-0.5*Math.abs(Math.pow(2-t,pow));
}


function getBackInOut(t,amount) 
{
	amount*=1.525;
	if ((t*=2)<1) return 0.5*(t*t*((amount+1)*t-amount));
	return 0.5*((t-=2)*t*((amount+1)*t+amount)+2);
}

function EaseBackInOut(t)
{
	return getBackInOut(t,1.7);
}


function getElasticIn(t,amplitude,period) 
{
	let pi2 = Math.PI*2;
	if (t==0 || t==1) return t;
	let s = period/pi2*Math.asin(1/amplitude);
	return -(amplitude*Math.pow(2,10*(t-=1))*Math.sin((t-s)*pi2/period));
	
};


function getElasticOut(t,amplitude,period) 
{
	let pi2 = Math.PI*2;
	if (t==0 || t==1) return t;
	let s = period/pi2 * Math.asin(1/amplitude);
	return (amplitude*Math.pow(2,-10*t)*Math.sin((t-s)*pi2/period )+1);

};

function getElasticInOut(t,amplitude,period) 
{
	let pi2 = Math.PI*2;
	let s = period/pi2 * Math.asin(1/amplitude);
	if ((t*=2)<1) return -0.5*(amplitude*Math.pow(2,10*(t-=1))*Math.sin( (t-s)*pi2/period ));
	return amplitude*Math.pow(2,-10*(t-=1))*Math.sin((t-s)*pi2/period)*0.5+1;
	
};

function getBackIn (t,amount)
{
		return t*t*((amount+1)*t-amount);
}

function getBackOut(t,amount) 
{
		return (--t*t*((amount+1)*t + amount) + 1);
}


class Ease 
{
	static Linear(progress) 
	{
	  return progress;
	}
  
	static InQuad(progress) 
	{
	  return getPowIn(progress, 2);
	}
  
	static OutQuad(progress) 
	{
	  return getPowOut(progress, 2);
	}
  
	static InOutQuad(progress) 
	{
	  return getPowInOut(progress, 2);
	}
  
	static SineIn(t) 
	{
	  return 1 - Math.cos(t * Math.PI / 2);
	}
  
	static SineOut(t) 
	{
	  return Math.sin(t * Math.PI / 2);
	}
  
	static SineInOut(t) 
	{
	  return -0.5 * (Math.cos(Math.PI * t) - 1);
	}
  
	static BounceIn(t) 
	{
	  return 1 - Ease.BounceOut(1 - t);
	}
  
	static BounceOut(t) 
	{
	  if (t < 1 / 2.75) 
	  {
		return 7.5625 * t * t;
	  } else if (t < 2 / 2.75)
	   {
		return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
	  } else if (t < 2.5 / 2.75)
	  {
		return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
	  } else 
	  {
		return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
	  }
	}
  
	static BounceInOut(t) 
	{
	  if (t < 0.5) return Ease.BounceIn(t * 2) * 0.5;
	  return Ease.BounceOut(t * 2 - 1) * 0.5 + 0.5;
	}
  
	static ElasticIn(t) 
	{
	  return getElasticIn(t, 1, 0.3);
	}
  
	static ElasticOut(t) 
	{
	  return getElasticOut(t, 1, 0.3);
	}
  
	static ElasticInOut(t) 
	{
	  return getElasticInOut(t, 1, 0.3 * 1.5);
	}
  
	static BackIn(t) 
	{
	  return getBackIn(t, 1.7);
	}
  
	static BackOut(t) 
	{
	  return getBackOut(t, 1.7);
	}
  
	static BackInOut(t)
	 {
	  return getBackInOut(t, 1.7);
	}
  
	static CircIn(t) 
	{
	  return -(Math.sqrt(1 - t * t) - 1);
	}
  
	static CircOut(t) 
	{
	  return Math.sqrt(1 - (--t) * t);
	}
  
	static CircInOut(t)
	 {
	  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
	  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
	}
  
  }
  
class Matrix2D
{
	
	constructor()
	{
	this.a = 1;
	this.b = 0;
	this.c = 0;
	this.d = 1;
	this.tx = 0;
	this.ty = 0;
	}

	identity()
	{
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
		return this;
	}
	set(a, b, c, d, tx, ty)
	{
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
		return this;
	}
	translate(x, y)
	{
		this.tx += x;
		this.ty += y;
		return this;
	}
	scale(x, y)
	{
		this.a *= x;
		this.d *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	}
	skew(skewX, skewY)
	{
		let sinX = Math.sin(skewX);
		let cosX = Math.cos(skewX);
		let sinY = Math.sin(skewY);
		let cosY = Math.cos(skewY);
	   
		this.set(this.a  * cosY - this.b  * sinX,
				this.a  * sinY + this.b  * cosX,
				this.c  * cosY - this.d  * sinX,
				this.c  * sinY + this.d  * cosX,
				this.tx * cosY - this.ty * sinX,
				this.tx * sinY + this.ty * cosX);
	}
	rotate(angle)
	{
		let cos = Math.cos(angle);
		let sin = Math.sin(angle);
		let a = this.a;
		let c = this.c;
		let tx = this.tx;
		this.a = a * cos - this.b * sin;
		this.b = a * sin + this.b * cos;
		this.c = c * cos - this.d * sin;
		this.d = c * sin + this.d * cos;
		this.tx = tx * cos - this.ty * sin;
		this.ty = tx * sin + this.ty * cos;
		return this;
	}
	transformPoint(x, y)
	{
		return new Vector2(this.a * x + this.c * y + this.tx, this.b * x + this.d * y + this.ty);
	}

	transformRef(x, y, to)
	{
		to.x = this.a * x + this.c * y + this.tx;
		to.y = this.b * x + this.d * y + this.ty;
		return to;
	}

	transformVectorRef(v, to)
	{
		to.x = this.a * v.x + this.c * v.y + this.tx;
		to.y = this.b * v.x + this.d * v.y + this.ty;
		return to;
	}

	
	
	clone()
	{
		return new Matrix2D().set(this.a, this.b, this.c, this.d, this.tx, this.ty);
	}
	copy(matrix)
	{
		return this.set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	concat(matrix)
	{
		let a = this.a;
		let c = this.c;
		let tx = this.tx;
		this.a = a * matrix.a + this.b * matrix.c;
		this.b = a * matrix.b + this.b * matrix.d;
		this.c = c * matrix.a + this.d * matrix.c;
		this.d = c * matrix.b + this.d * matrix.d;
		this.tx = tx * matrix.a + this.ty * matrix.c + matrix.tx;
		this.ty = tx * matrix.b + this.ty * matrix.d + matrix.ty;
		return this;
	}
	prepend(matrix)
	{
		let a = this.a;
		let b = this.b;
		let c = this.c;
		let d = this.d;
		this.a = matrix.a * a + matrix.b * c;
		this.b = matrix.a * b + matrix.b * d;
		this.c = matrix.c * a + matrix.d * c;
		this.d = matrix.c * b + matrix.d * d;
		this.tx += matrix.tx * a + matrix.ty * c;
		this.ty += matrix.tx * b + matrix.ty * d;
		return this;
	}
	invert()
	{
		let a = this.a;
		let b = this.b;
		let c = this.c;
		let d = this.d;
		let tx = this.tx;
		let ty = this.ty;
		let det = a * d - b * c;
		if (det === 0)
		{
			this.identity();
		} else
		{
			det = 1 / det;
			this.a = d * det;
			this.b = -b * det;
			this.c = -c * det;
			this.d = a * det;
			this.tx = (c * ty - d * tx) * det;
			this.ty = (b * tx - a * ty) * det;
		}
		return this;
	}

	mult(m)
	{
		let a = this.a;
		let b = this.b;
		let c = this.c;
		let d = this.d;
		let tx = this.tx;
		let ty = this.ty;
		this.a = m.a * a + m.b * c;
		this.b = m.a * b + m.b * d;
		this.c = m.c * a + m.d * c;
		this.d = m.c * b + m.d * d;
		this.tx = m.tx * a + m.ty * c + tx;
		this.ty = m.tx * b + m.ty * d + ty;
		return this;
	}
	transformBound(bound)
	{
		let x = bound.x;
		let y = bound.y;
		let xMax = x + bound.width;
		let yMax = y + bound.height;
		let x0 = this.a * x + this.c * y + this.tx;
		let y0 = this.b * x + this.d * y + this.ty;
		let x1 = this.a * xMax + this.c * y + this.tx;
		let y1 = this.b * xMax + this.d * y + this.ty;
		let x2 = this.a * xMax + this.c * yMax + this.tx;
		let y2 = this.b * xMax + this.d * yMax + this.ty;
		let x3 = this.a * x + this.c * yMax + this.tx;
		let y3 = this.b * x + this.d * yMax + this.ty;
		let minX = Math.min(x0, x1, x2, x3);
		let maxX = Math.max(x0, x1, x2, x3);
		let minY = Math.min(y0, y1, y2, y3);
		let maxY = Math.max(y0, y1, y2, y3);
		return new Bound(minX, minY, maxX - minX, maxY - minY);
	}
	transformBoundRef(bound,to)
	{
		let x = bound.x;
		let y = bound.y;
		let xMax = x + bound.width;
		let yMax = y + bound.height;
		let x0 = this.a * x + this.c * y + this.tx;
		let y0 = this.b * x + this.d * y + this.ty;
		let x1 = this.a * xMax + this.c * y + this.tx;
		let y1 = this.b * xMax + this.d * y + this.ty;
		let x2 = this.a * xMax + this.c * yMax + this.tx;
		let y2 = this.b * xMax + this.d * yMax + this.ty;
		let x3 = this.a * x + this.c * yMax + this.tx;
		let y3 = this.b * x + this.d * yMax + this.ty;
		let minX = Math.min(x0, x1, x2, x3);
		let maxX = Math.max(x0, x1, x2, x3);
		let minY = Math.min(y0, y1, y2, y3);
		let maxY = Math.max(y0, y1, y2, y3);
		to.set(minX, minY, maxX - minX, maxY - minY);
		return to;
	}

	static Multiply(m1, m2)
	{
		return new Matrix2D().set(m1.a * m2.a + m1.b * m2.c, m1.a * m2.b + m1.b * m2.d, m1.c * m2.a + m1.d * m2.c, m1.c * m2.b + m1.d * m2.d, m1.tx * m2.a + m1.ty * m2.c + m2.tx, m1.tx * m2.b + m1.ty * m2.d + m2.ty);
	}
	static Identity()
	{
		return new Matrix2D();
	}
	static Translate(x, y)
	{
		return new Matrix2D().translate(x, y);
	}
	static Scale(x, y)
	{
		return new Matrix2D().scale(x, y);
	}
	static Rotate(angle)
	{
		return new Matrix2D().rotate(angle);
	}
	static TransformPoint(matrix, x, y)
	{
		return new Vector2(matrix.a * x + matrix.c * y + matrix.tx, matrix.b * x + matrix.d * y + matrix.ty);
	}
	static Clone(matrix)
	{
		return new Matrix2D().set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	static Copy(matrix, m)
	{
		return m.set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
	}
	static Concat(m1, m2)
	{
		return new Matrix2D().set(m1.a, m1.b, m1.c, m1.d, m1.tx, m1.ty).concat(m2);
	}
	static Prepend(m1, m2)
	{
		return new Matrix2D().set(m1.a, m1.b, m1.c, m1.d, m1.tx, m1.ty).prepend(m2);
	}
	static Invert(matrix)
	{
		return new Matrix2D().set(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty).invert();
	}
}
