let myPiece, myObstacle=[], clouds=[], myBackground, planes=[], anotherPlanes=[], build=[];
let mySound, myMusic;
let score=document.getElementById("score");
let q = 0;
let points = 0;
const socket = io();

function startMove(){
	area.start();
	myMusic = new Sound("First fight.mp3");
	//myMusic.Play();
	myPiece = new component(60,80,"img/iron-man.png",0,area.canvas.height/2,"image");
	myBackground = new  component(1000,500,"img/bluesky4.png",0,0,"background");
	mySound = new Sound("Love me again.mp3");
}
function Sound(src){
	this.sound=document.createElement("audio");
	this.sound.src=src;
	this.sound.setAttribute("preload","auto");
	this.sound.setAttribute("controls","none");
	this.sound.style.display="none";
	document.body.appendChild(this.sound);
	this.Play = function(){
		this.sound.play();// try to fix
	}
	this.stop = function(){
		this.sound.pause();
	}
}
let area = {
	canvas: document.createElement("canvas"),
	start: function(){
		this.canvas.width= 1000;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(updateArea,20);
		this.frameNo = 0;
		window.addEventListener("keydown", function(e){
			area.key = (area.key || []);
			area.key[e.keyCode] = true;
		});
		window.addEventListener("keyup", function(e){
			area.key[e.keyCode] = false;
		});
	},
	clear: function(){
		document.querySelectorAll('.points')[1].innerHTML = points;
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	stop: function(){
		clearInterval(this.interval);
	}
}
function everyInterval(n){
	if((area.frameNo / n) % 1 ==0) return true;
	else return false;
}

function component(width, height, color, x, y,type){
 	this.type=type;
 	if(this.type=="image" || this.type== "background" || this.type=="cloud" || this.type=="plane" || this.type=="build"){
 		this.image= new Image();
 		this.image.src=color;
 	}
 	this.width=width;
 	this.height=height;
 	this.speedX=0;
 	this.speedY=0;
 	this.x=x;
 	this.y=y;
	if(this.type == "cloud") {
		this.ym = 100;
	}
 	this.update =  function(){
 		ctx = area.context;
	 	if(this.type=="image" || this.type=="background"){
	 		ctx.drawImage(this.image, this.x,this.y,this.width,this.height);
	 		if(this.type=="background") ctx.drawImage(this.image,this.x+this.width,this.y,this.width,this.height);
	 	}
	 	else{
	 		if(this.type=="cloud") ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
	 		else if(this.type=="plane") ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
	 		else if(this.type=="build") ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
	 		else{
	 			ctx.fillStyle=color;
	 			ctx.fillRect(this.x,this.y,this.width,this.height);
	 		}
 		}
 	}
 	this.newPos = function(){
	 	this.x+=this.speedX;
	 	this.y+=this.speedY;
 	}
 	this.crashWith= function (obj){
 		let myleft = this.x;
 		let myright = this.x+ this.width;
 		let mytop = this.y;
 		let mybottom=this.y+this.height;
 		let objleft = obj.x;
 		let objright = obj.x+obj.width;
 		let objtop = obj.y;
 		let objbottom = obj.y + obj.height;
 		let crash=true;
 		if(mybottom < objtop || mytop > objbottom || myright<objleft || myleft>objright) crash = false;
 		return crash;
 	}
 	this.Pos = () => {if(this.type=="background") if(this.x==-(this.width)) this.x=0;}
}
function updateArea(){
 	let x,y;
 	myMusic.Play();
 	for(var i=0;i<myObstacle.length;i++){
		if(myPiece.crashWith(myObstacle[i])){
			gameOver();
	 		return;
	 	}
 	}
 	for(var i=0;i<clouds.length;i++){
	 	if(myPiece.crashWith(clouds[i])){
			gameOver();
	 		return;
	 	}
 	}
 	for(var i=0;i<planes.length;i++){
	 	if(myPiece.crashWith(planes[i])){
			gameOver();
	 		return;
	 	}
 	}
 	for(var i=0;i<anotherPlanes.length;i++){
	 	if(myPiece.crashWith(anotherPlanes[i])){
			gameOver();
	 		return;
	 	}
 	}
 	for(var i=0;i<build.length;i++){
	 	if(myPiece.crashWith(build[i])){
			gameOver();
	 		return;
	 	}
 	}
	area.clear();
	area.frameNo +=1;
	//myBackground.x+=-1;
	myBackground.Pos();
	myBackground.update();
	if(area.frameNo == 1 || everyInterval(myPiece.width*10)){
	 	x = area.canvas.width;
	 	y = area.canvas.height-320;
	 	myObstacle.push(new component(100,60,"img/cloud.png",x,y,"cloud"));
	}
	if(area.frameNo == 1 || everyInterval(myPiece.width*8)){
	 	x = area.canvas.width;
	 	y = area.canvas.height-450;
	 	clouds.push(new component(100,60,"img/cloud.png",x,y,"cloud"));
	}
	if(area.frameNo == 1 || everyInterval(myPiece.width*11)){
	 	x = area.canvas.width;
	 	y = area.canvas.height-370;
	 	planes.push(new component(80,30,"img/plane.png",x,y,"plane"));
	}
	if(area.frameNo == 1 || everyInterval(myPiece.width*15)){
	 	x = area.canvas.width;
	 	y = area.canvas.height-490;
	 	anotherPlanes.push(new component(100,30,"img/plane.png",x,y,"plane"));
	}
	if(area.frameNo == 1 || everyInterval(myPiece.width*2)){
	 	x = area.canvas.width;
	 	minHeight=20;
	 	maxHeight=300;
	 	height=Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
	 	minGap=20;
	 	maxGap=300;
	 	gap=Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
	 	build.push(new component(60,height,"img/build.png",x,500-height,"build"));
	}
	//*****************************************************************War Machine */
	for(i=0; i<myObstacle.length;i++){
	 	myObstacle[i].x+=-3;
		 if(myObstacle[i].ym > 0) {
			myObstacle[i].y++;
			myObstacle[i].ym--;
			if(myObstacle[i].ym == 0) {
				myObstacle[i].ym = -100;
				EnemyShoot(myObstacle[i].x, myObstacle[i].y);
			}
		}
		if(myObstacle[i].ym < 0) {
			myObstacle[i].y--;
			myObstacle[i].ym++;
			if(myObstacle[i].ym == -1) {
				myObstacle[i].ym = 100;
				EnemyShoot(myObstacle[i].x, myObstacle[i].y);
			}
		}
	 	myObstacle[i].update();
	}
	for(i=0; i<clouds.length;i++){
	 	clouds[i].x+=-3;
		if(clouds[i].ym > 0) {
			clouds[i].y++;
			clouds[i].ym--;
			if(clouds[i].ym == 0) {
				EnemyShoot(clouds[i].x, clouds[i].y);
				clouds[i].ym = -100;
			}
		}
		if(clouds[i].ym < 0) {
			clouds[i].y--;
			clouds[i].ym++;
			if(clouds[i].ym == -1) {
				EnemyShoot(clouds[i].x, clouds[i].y);
				clouds[i].ym = 100;
			}
		}
	 	clouds[i].update();
	}
	for(i=0; i<planes.length;i++){
	 	planes[i].x+=-3;
	 	planes[i].update();
	}
	for(i=0; i<anotherPlanes.length;i++){
	 	anotherPlanes[i].x+=-6;
	 	anotherPlanes[i].update();
	}
	for(i=0; i<build.length;i++){
	 	build[i].x+=-2;
	 	build[i].update();
	}
  	myPiece.newPos();
	myPiece.speedX=0;//
	myPiece.speedY=0;//
	if(area.key && area.key[37]) {
		myPiece.image.src="img/iron-man(move-left).png";
		myPiece.width = 85;
		myPiece.height = 35;
		myPiece.x=Math.max(myPiece.x,0);
		myPiece.speedX-=10;
	}
	if(area.key && area.key[38]) {
		myPiece.image.src="img/iron-man.png";
		myPiece.width = 60;
		myPiece.height = 70;
		myPiece.y=Math.max(myPiece.y,0);
		myPiece.speedY-=5;
	}
	if(area.key && area.key[39]) {
		myPiece.image.src="img/iron-man(move).png";
		myPiece.width = 85;
		myPiece.height = 35;
		myPiece.x=Math.min(myPiece.x,area.canvas.width-myPiece.width);
		myPiece.speedX+=10;
	}
	if(area.key && area.key[40]) {
		myPiece.image.src="img/iron-man(down).png";
		myPiece.width = 60;
		myPiece.height = 70;
		myPiece.y = Math.min(myPiece.y,area.canvas.height-myPiece.height);
		myPiece.speedY+=5;
	}
	myPiece.update();
	for(let i in missiles) {

		if(missiles[i].show) {
			ctx.drawImage(missileImg, missiles[i].x, missiles[i].y, 20,6);
			missiles[i].x += 10;
			if(missiles[i].x > 1040) {
				missiles[i].show = false;
				data += `(missed, ${points})`;
			}
		}

		if(enemyMissiles[i].show) {
			ctx.drawImage(enemyMissileImg, enemyMissiles[i].x, enemyMissiles[i].y, 20,6);
			enemyMissiles[i].x -= 5;
			if(enemyMissiles[i].x < -20) enemyMissiles[i].show = false;
		}

	}


	enemyMissiles.forEach((el) => {
		if(!el.show) return;
		if( myPiece.x + 40 < el.x + 25 &&
			myPiece.x + myPiece.width - 40 > el.x &&
			myPiece.y < el.y + 6 &&
			myPiece.y + myPiece.height > el.y) gameOver();
	});
	missiles.forEach((el) => {
		if(!el.show) return;
		clouds.forEach((cloud)=> {
			if(el.x < cloud.x + cloud.width &&
				el.x + 40 > cloud.x &&
				el.y < cloud.y + cloud.height &&
				el.y + 6 > cloud.y) {
					points++;
					el.show = false;
					data += `(destroyed, ${points})`;
					cloud.x = 2000;
				}

		});
		myObstacle.forEach((cloud)=> {
			if(el.x < cloud.x + cloud.width &&
				el.x + 40 > cloud.x &&
				el.y < cloud.y + cloud.height &&
				el.y + 6 > cloud.y) {
					points++;
					el.show = false;
					data += `(destroyed, ${points})`;
					cloud.x = 1300;
				}
		});
		planes.forEach((cloud)=> {
			if(el.x < cloud.x + cloud.width &&
				el.x + 40 > cloud.x &&
				el.y < cloud.y + cloud.height &&
				el.y + 6 > cloud.y) {
					points++;
					el.show = false;
					data += `(destroyed, ${points})`;
					cloud.x = 1700;
				}
		});
		anotherPlanes.forEach((cloud)=> {
			if(el.x < cloud.x + cloud.width &&
				el.x + 40 > cloud.x &&
				el.y < cloud.y + cloud.height &&
				el.y + 6 > cloud.y) {
					points++;
					el.show = false;
					data += `(destroyed, ${points})`;
					cloud.x = 1500;
				}
		});
		//myObstacle.forEach((cloud)=> {});
	});
}

document.addEventListener('keydown', (e)=> {if(e.code == 'Space') shoot()});
let missileImg = new Image();
missileImg.src = 'img/missile.png';
let enemyMissileImg = new Image();
enemyMissileImg.src = 'img/enemyMissile.png'
let missiles = [
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
];

let enemyMissiles = [
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
	{x:0,y:0,show: false,},
];

let data = '';

function shoot() {
	for(let i in missiles) {
		if(!missiles[i].show) {
			missiles[i].show = true;
			missiles[i].x = myPiece.x + myPiece.width;
			missiles[i].y = myPiece.y + (myPiece.height / 2) - 10;
			break;
		}
	}
}

function EnemyShoot(x,y) {
	for(let i in enemyMissiles) {
		if(!enemyMissiles[i].show) {
			enemyMissiles[i].show = true;
			enemyMissiles[i].x = x;
			enemyMissiles[i].y = y;
			break;
		}
	}
}

function gameOver() {
	myMusic.stop();
	mySound.Play();
	area.stop();
	//document.querySelector('.missiles').innerHTML = data;
	document.querySelectorAll('.points')[0].innerHTML = points;
	document.querySelector('.gameover').classList.remove('hide');
}
function send(){
   socket.emit('message',{data});
   alert("Score successfully saved!");
  }

moveUp = () => myPiece.speedY-=1;
moveDown =() =>myPiece.speedY+=1;
moveRight = () =>myPiece.speedX+=1;
moveLeft = () =>myPiece.speedX-=1;
stopMove = () => {myPiece.speedX=0; myPiece.speedY=0;}
