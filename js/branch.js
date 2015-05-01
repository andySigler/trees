/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

function Branch(){

	this.rot;
	this.step;
	this.stepFeedback = 1.001;
	this.rightSin = Math.sin(Math.PI*.5);

	this.rad;
	this.radFeedback;
	this.radThresh = 2.5;

	this.x;
	this.y;

	this.lifeCount=0;

	this.wiggle;

	this.historyDivider = 15;

	this.history;
	this.prevX = [];
	this.prevY = [];

	this.done = false;

	this.splitProb;

	this.splitThresh;
	this.splitAngle;

	this.startRad;
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

Branch.prototype.init = function(_x,_y,_rot,_rad,_step,_cIndex,_splitThresh,_startRad,_splitProb,_splitAngle,_leafProb,_wiggle,_feedback){
	this.x = _x;
	this.y = _y;
	this.rot = _rot;
	this.rad = _rad;
	this.step=_step;

	this.history = Math.floor(this.rad/this.historyDivider)+3;
	this.prevX = [];
	this.prevY = [];

	this.leafProb = _leafProb;

	this.wiggle = _wiggle;

	this.radFeedback = _feedback;

	this.splitAngle = _splitAngle;

	this.color = _cIndex;

	this.startRad = _startRad;
	this.splitProb = _splitProb

	this.splitThresh = _splitThresh

	for(var i=0;i<this.history;i++){
		this.prevX[i] = this.x;
		this.prevY[i] = this.y;
	}
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

Branch.prototype.updatePosition = function(){
	//calculate difference in x and y based off
	//previous location, distance moved, and angle moved

	var tempRot = this.rot%(Math.PI*.5); //because rotation will change over time...
	var thirdAngle = Math.PI-(Math.PI*.5+tempRot);

	var sinValue_given = this.step/this.rightSin;

	var xDist = 0;
	var yDist = 0;

	//depending on the direction...
	var whatDirection = Math.floor(this.rot/(Math.PI*.5));

	if(whatDirection===0){      
		xDist = sinValue_given*Math.sin(tempRot);
		yDist = sinValue_given*Math.sin(thirdAngle);
	}
	else if(whatDirection===1){      
		xDist = sinValue_given*Math.sin(thirdAngle);
		yDist = sinValue_given*Math.sin(tempRot)*-1;
	}
	else if(whatDirection===2){      
		xDist = sinValue_given*Math.sin(tempRot)*-1;
		yDist = sinValue_given*Math.sin(thirdAngle)*-1;
	}
	else if(whatDirection===3){      
		xDist = sinValue_given*Math.sin(thirdAngle)*-1;
		yDist = sinValue_given*Math.sin(tempRot);
	}

	this.x+=xDist;
	this.y+=yDist;

	this.rot = this.rot+(Math.random()*this.wiggle*2-this.wiggle);
	if(this.rot<0){
		this.rot=(Math.PI*2)+this.rot;
	}
	else if(this.rot>Math.PI*2){
		this.rot-=(Math.PI*2);
	}

	if(this.rad>this.radThresh){
		this.rad*=this.radFeedback;
	}
	else{
		this.done = true;
	}

	this.history = Math.floor(this.rad/this.historyDivider)+2;

	for(var i=0;i<this.history-1;i++){
		this.prevX[i] = this.prevX[i+1];
		this.prevY[i] = this.prevY[i+1];
	}
	this.prevX[this.history-1] = this.x;
	this.prevY[this.history-1] = this.y;

	this.step*=this.stepFeedback;
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

Branch.prototype.paint = function(ctx){
	this.lifeCount++;
	var eraseScale = 0.95;

	ctx.fillStyle = 'rgba(0,0,0,.3)';
	ctx.beginPath();
	ctx.arc(this.x,this.y,this.rad,0,Math.PI*2,false);
	ctx.fill();
	ctx.fillStyle = 'rgba(255,255,255,1)';

	var eraseSize = this.rad*eraseScale;
	if(eraseSize<this.radThresh-1){
		eraseSize=3;
	}
	ctx.beginPath();
	ctx.arc(this.prevX[0],this.prevY[0],eraseSize,0,Math.PI*2,false);
	ctx.fill();
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

var colors = [
	{
		'r':28,
		'g':56,
		'b':15
	},
	{
		'r':104,
		'g':17,
		'b':23
	},
	{
		'r':207,
		'g':0,
		'b':30
	},
	{
		'r':235,
		'g':68,
		'b':70
	},
	{
		'r':251,
		'g':141,
		'b':73
	},
	{
		'r':249,
		'g':189,
		'b':97
	},
	{
		'r':83,
		'g':124,
		'b':42
	},
	{
		'r':41,
		'g':67,
		'b':30
	},
	{
		'r':48,
		'g':70,
		'b':44
	}
];

Branch.prototype.leaf = function(colorIndex,ctx){
	var leafRand = 15;
	var leafX = this.x+(Math.random()*leafRand-(leafRand*.5));
	var leafY = this.y+(Math.random()*leafRand-leafRand);
	var leafFill = Math.pow(Math.random()*.7,4)+.5;
	if(Math.random()<1){
		if(Math.random()<.5){
			var r = 255-colors[colorIndex].r;
			var g = 255-colors[colorIndex].g;
			var b = 255-colors[colorIndex].b;
			ctx.fillStyle = 'rgba('+r+','+g+','+b+','+leafFill+')';
		}
		else{
			var r = 255-colors[(colorIndex+1)%colors.length].r;
			var g = 255-colors[(colorIndex+1)%colors.length].g;
			var b = 255-colors[(colorIndex+1)%colors.length].b;
			ctx.fillStyle = 'rgba('+r+','+g+','+b+','+leafFill+')';
		}
		var leafSize = Math.random()*10+2;
		ctx.beginPath();
		ctx.arc(leafX,leafY,leafSize,0,Math.PI*2,false);
		ctx.fill();
	}
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////