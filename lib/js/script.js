var scene, camera, renderer, you, ennemy, line1, x_ennemy, z_global, y_ennemy, planeBuffer, plane, planeMat, light;
var bullet_x = 0.1; var bullet_y = 0.8; var bullet_z = 0.01;
var ennemy_large_x = 1; var ennemy_large_y = 0.5; var ennemy_large_z = 0.3;
var you_large_x = 1; var you_large_y = 0.5; var you_large_z = 0.3;
var shield_large_x = 1.2; var shield_large_y = 0.3; var shield_large_z = 0.3;
var tickX, tickY, left;
var frontEnnemy;
var y_min;
var newElem;
var levelmax = 1;
var currentLevel = 1;
var ennemyPoint = 1; var totalP = 0;
var currentDiv = document.getElementById("base");
var score = 0;
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
width -= 20;
height -= 20;
console.log(width+" "+height);
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
left = true;
tickX = 400;
tickY = 2;
z_global = -10;
var keyboard = {};
var opponents = [];
var shields = [];
var killAnimation = [];
var bullets = [];
var enBullets = [];
var play = false;

var modelEnnemytxt = '{'+
	'"ennemies": ['+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "color": "0xB0E0E6", "hp": "1"},'+
		'{"num": "1", "name": "sbire+", "value": "2", "color": "0x31698A", "hp": "2"},'+
		'{"num": "1", "name": "sbire+", "value": "2", "color": "0x31698A", "hp": "2"},'+
		'{"num": "1", "name": "sbire+", "value": "2", "color": "0x31698A", "hp": "2"},'+
		'{"num": "1", "name": "sbire+", "value": "2", "color": "0x31698A", "hp": "2"},'+
		'{"num": "1", "name": "sbire+", "value": "2", "color": "0x31698A", "hp": "2"},'+
		'{"num": "1", "name": "sbire+", "value": "2", "color": "0x31698A", "hp": "2"},'+
		'{"num": "2", "name": "super sbire", "value": "3", "color": "0xFCCF40", "hp": "3"},'+
		'{"num": "2", "name": "super sbire", "value": "3", "color": "0xFCCF40", "hp": "3"},'+
		'{"num": "2", "name": "super sbire", "value": "3", "color": "0xFCCF40", "hp": "3"},'+
		'{"num": "2", "name": "super sbire", "value": "3", "color": "0xFCCF40", "hp": "3"},'+
		'{"num": "3", "name": "mini boss", "value": "10", "color": "0xff7400", "hp": "5"},'+
		'{"num": "3", "name": "mini boss", "value": "10", "color": "0xff7400", "hp": "5"},'+
		'{"num": "4", "name": "boss", "value":"100", "color": "0xFF0033", "hp": "10"}'+
	']'+
'}';
var modelEnnemy = JSON.parse(modelEnnemytxt);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function ennemyRandom(level){
	switch (level){
		case 1:
			return modelEnnemy.ennemies[getRandomInt(8)];
			break;
		case 2:
			return modelEnnemy.ennemies[getRandomInt(14)];
			break;
		case 3: 
			return modelEnnemy.ennemies[getRandomInt(18)];
			break;
		case 4:
			return modelEnnemy.ennemies[getRandomInt(20)];
			break;
		default: 
			return modelEnnemy.ennemies[getRandomInt(21)];
			break;
	}

}


function init() {
	$("#popup").hide();
	$("#score").hide();
	initBase();
	initLevel(levelmax);
	animate();
}

function initBase(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(70, 1920 / 1080, 0.1, 1000);
	renderer = new THREE.WebGLRenderer({
		antialias: false, //enable antialiasing
		preserveDrawingBuffer: true //enable screenshot
	});
	if( THREEx.FullScreen.available() ){
		THREEx.FullScreen.bindKey();		
	}
	THREEx.WindowResize.bind(renderer, camera);
	renderer.setSize(width, height); //window's size
	document.body.appendChild(renderer.domElement);
	light  = new THREE.AmbientLight();
	scene.add(light);
}

function initLevel(level){
	console.log("Création du level...")
	score = 0;
	plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(40, 30, 32),
		new THREE.MeshPhongMaterial({
			color: 0x741B47,
			side: THREE.DoubleSide
		})
	);
	plane.position.set(0,0,-12);
	scene.add(plane);
	camera.position.z = -8;
	camera.position.y = -15;
	
	initHero();
	initProtect();
	initEnnemy(level);
	$("#score").html(score).show();
	
}


function deleteScene(){
	clean(you);
	opponents.forEach(function(element){
		clean(element);
	});
	opponents.length = 0;
	enBullets.forEach(function(element){
		clean(element);
	});
	enBullets.length = 0;
	bullets.forEach(function(element){
		clean(element);
	});
	bullets.length = 0;
	initLevel(currentLevel);
    play=true;
    requestAnimationFrame(animate);
}



function restartlevel(){
	$("#popup").dialog("close");
	deleteScene();
}

function youWin(){
	totalP += score;
	play = false;
	$("#popup").html(
		"You win !</br>"+
		"Score for this level : "+score+
		"</br>Your total score :"+totalP+
		"<form action=\"javascript:nextlevel();\"><button type=\"submit\" id=\"nextlevel\">Next level</button></form>"
		).dialog();
}

function nextlevel(){
 	currentLevel++;
 	if(currentLevel == levelmax){
 		levelmax++;
 	}
 	$("#popup").dialog("close");
 	deleteScene();
}

function initHero(){
	console.log("Création du héros...")
	you = new THREE.Mesh(
		new THREE.BoxBufferGeometry(ennemy_large_x, ennemy_large_y, ennemy_large_z),
		new THREE.MeshPhongMaterial({
			color: 0x15F0E6,
			wireframe: false
		})
	); //create hero
	you.canShoot = 0;
	you.position.set(0, -10, z_global); //placing hero
	you.kill = function(){
		console.log("hit");
		play = false;
		$("#popup").html("you loose <form action=\"javascript:restartlevel();\"><button type=\"submit\" id=\"restartlvl\">retry</button></form>");
		$("#popup").dialog();
	}
	scene.add(you);//adding hero
	play = true;

	/*var loadingManager = new THREE.LoadingManager( function() {

		scene.add( elf );

	} );

	// collada

	var loader = new THREE.OBJLoader();
	loader.load( 'lib/js/fighter/fighter.obj', function ( collada ) {

		elf = collada;
		scene.add(elf);
	} );*/
	console.log("..Done");
}

function initProtect(){
	var x_shield = -4;
	for(var i=0; i<5; i++){
		shields.push(
			shield = new THREE.Mesh(
				new THREE.BoxBufferGeometry(shield_large_x, shield_large_y, shield_large_z),
				new THREE.MeshPhongMaterial({
					color: 0xFF0033,
					wireframe: false
				})
			)
		);
		shields[i].hp = 5;
		shields[i].position.set(x_shield,-8, z_global);
		x_shield += 3;
		scene.add(shields[i]);
	}
}

function initEnnemy(level){
	var o = 0;
	var nbEnnemy;
	x_ennemy = -6.5;
	y_ennemy = 5;
	for (i = 0; i < 100; i++) {
		var thisEn = ennemyRandom(level);
		console.log(thisEn);
		console.log(thisEn.color);
		var color = thisEn.color;
		if(i == o+10){
			o += 10;
			y_ennemy -= 0.7;
			x_ennemy = -6.5;
		}
		opponents.push(
			ennemy = new THREE.Mesh(
				new THREE.BoxBufferGeometry(ennemy_large_x, ennemy_large_y, ennemy_large_z),
				new THREE.MeshPhongMaterial({
					color: parseInt(thisEn.color),
					wireframe: false
				})
			)
		);
		killAnimation[i] = false;
		opponents[i].value = parseInt(thisEn.value);
		opponents[i].position.set(x_ennemy, y_ennemy, z_global);
		x_ennemy += 2;
		scene.add(opponents[i]);
	}
	ennemy.canShoot=10;
}

function animate() {
	stats.begin();
	if(!play) return; //pause
	requestAnimationFrame(animate);
	camera.position.x = you.position.x;
	camera.lookAt(you.position);
	gestionBullet();
	gestionEnBullet();
	//moving every frame
	ennemyMove();
	ennemyShoot();

	if (keyboard[37]) { //left
		you.position.x -= 0.1;
	}
	if (keyboard[39]) { //right
		you.position.x += 0.1;
	}
	if (keyboard[38]) { //up
		you.position.y += 0.01;
	}
	if (keyboard[40]) { //down
		you.position.y -= 0.01;
	}
	if (keyboard[33]) { //pag.up
		you.position.z += 0.01;
	}
	if (keyboard[34]) { //pag.down
		you.position.z -= 0.01;
	}


	if (keyboard[32] && you.canShoot <= 0) { //space
		var bullet = new THREE.Mesh(
			new THREE.BoxBufferGeometry(bullet_x, bullet_y, bullet_z),
			new THREE.MeshBasicMaterial({
				color: 0xFFFFFF
			})
		); //create a bullet
		bullet.position.set(
			you.position.x,
			you.position.y,
			you.position.z
		);


		bullet.velocity = new THREE.Vector3(0, 0.2, 0); //bullet's speed
		bullet.alive = true; //bullet still active
		setTimeout(function() {
			bullet.alive = false; //bullet inactive
			scene.remove(bullet); //deleting bullet
		}, 10000);
		bullets.push(bullet);
		scene.add(bullet);
		you.canShoot = 10; //10frames until next shoot
	}
	if (you.canShoot > 0) you.canShoot--; //counting frames
	if (ennemy.canShoot > 0) ennemy.canShoot--;
	stats.end();
	renderer.render(scene, camera);
}

function aimEnnemy(){
	y_min = 100;
	y_min = opponents[opponents.length-1].position.y;
	for(var u = opponents.length-1; u >= 0; u--){
		if(
			opponents[u].position.x-ennemy_large_x/2 <= you.position.x-ennemy_large_x/2 &&
			opponents[u].position.x+ennemy_large_x/2 >= you.position.x-ennemy_large_x/2 ||
			opponents[u].position.x+ennemy_large_x/2 <= you.position.x-ennemy_large_x/2 &&
			opponents[u].position.x-ennemy_large_x/2 >= you.position.x-ennemy_large_x/2	||
			opponents[u].position.x-ennemy_large_x/2 <= you.position.x+ennemy_large_x/2 &&
			opponents[u].position.x+ennemy_large_x/2 >= you.position.x+ennemy_large_x/2 ||
			opponents[u].position.x-ennemy_large_x/2 <= you.position.x+ennemy_large_x/2 &&
			opponents[u].position.x+ennemy_large_x/2 >= you.position.x+ennemy_large_x/2
		){ 
			y_min = opponents[u].position.y;
			return opponents[u];
			break;
		}
	}
	return opponents[opponents.length-1];
}

function ennemyShoot(){
	if(ennemy.canShoot <= 0){
		var enBullet = new THREE.Mesh(
			new THREE.BoxBufferGeometry(bullet_x, bullet_y, bullet_z),
			new THREE.MeshBasicMaterial({
				color: 0xFFFFFF
			})
		);
		y_min = 100;
		frontEnnemy = aimEnnemy();
		enBullet.position.set(
			frontEnnemy.position.x,
			frontEnnemy.position.y,
			frontEnnemy.position.z
		);
		enBullet.velocity = new THREE.Vector3(0, -0.1, 0);
		enBullet.alive = true;
		setTimeout(function(){
			enBullet.alive = false;
			clean(enBullet);
		}, 5000);
		enBullets.push(enBullet);
		ennemy.canShoot = 15; 
		scene.add(enBullet);  
	}
}


function gestionEnBullet(){
	//bullet management
	for (var index = 0; index < enBullets.length+1; index++) {
		if (enBullets[index] === undefined) continue;
		if (enBullets[index].alive == false) {
			enBullets.splice(index, 1);
			continue;
		}
		enBullets[index].position.add(enBullets[index].velocity);

		if(
			enBullets[index].position.x-bullet_x/2 >= you.position.x-you_large_x/2 && 
			enBullets[index].position.x+bullet_x/2 <= you.position.x+you_large_x/2 &&
			enBullets[index].position.y+bullet_y/2 >= you.position.y-you_large_y/2 &&
			enBullets[index].position.y+bullet_y/2 <= you.position.y+you_large_y/2 &&
			enBullets[index].position.z < you.position.z+you_large_z/2 &&
			enBullets[index].position.z > you.position.z-you_large_z/2 
		){
			enBullets[index].position.y -= 10;
			clean(enBullets[index]);
			you.kill();
			continue;
		}


		for(var loop=0; loop<shields.length; loop++){
			if(
				enBullets[index].position.x-bullet_x/2 >= shields[loop].position.x-shield_large_x/2 &&
				enBullets[index].position.x+bullet_x/2 <= shields[loop].position.x+shield_large_x/2 &&
				enBullets[index].position.y+bullet_y/2 >= shields[loop].position.y-shield_large_y/2 &&
				enBullets[index].position.y+bullet_y/2 <= shields[loop].position.y+shield_large_y/2 &&
				enBullets[index].position.z < shields[loop].position.z+shield_large_z/2 &&
				enBullets[index].position.z > shields[loop].position.z-you_large_z/2
			){
				enBullets[index].position.y -= 10;
				clean(enBullets[index]);
				shields[loop].hp--;
				if(shields[loop].hp == 0){
					refreshShieldArray(loop);
				}
			}
		}
	
	}
}


function gestionBullet(){
	//bullet management
	for (var index = 0; index < bullets.length; index++) {
		if (bullets[index] === undefined) continue;
		if (bullets[index].alive == false) {
			bullets.splice(index, 1);
			continue;
		}
		bullets[index].position.add(bullets[index].velocity); //move bullet
		//check position bullet / ennemy
		//move ennemy if bullet hit ennemy
		for(var loop=0; loop<opponents.length; loop++){
			if(
				bullets[index].position.x-bullet_x/2 >= opponents[loop].position.x-ennemy_large_x/2 && 
				bullets[index].position.x+bullet_x/2 <= opponents[loop].position.x+ennemy_large_x/2 &&
				bullets[index].position.y+bullet_y/2 > opponents[loop].position.y-ennemy_large_y/2 &&
				bullets[index].position.y+bullet_y/2 < opponents[loop].position.y+ennemy_large_y/2 &&
				bullets[index].position.z < opponents[loop].position.z+ennemy_large_z/2 &&
				bullets[index].position.z > opponents[loop].position.z-ennemy_large_z/2 
			){
				bullets[index].position.y -= 10;
				killAnimation[loop] = true;
				clean(bullets[index]);
				killAnim(loop);
				console.log("même X");
				continue;
			}
			
		}
		for(var loop=0; loop<shields.length; loop++){
			if(
				bullets[index].position.x-bullet_x/2 >= shields[loop].position.x-shield_large_x/2 &&
				bullets[index].position.x+bullet_x/2 <= shields[loop].position.x+shield_large_x/2 &&
				bullets[index].position.y+bullet_y/2 >= shields[loop].position.y-shield_large_y/2 &&
				bullets[index].position.y+bullet_y/2 <= shields[loop].position.y+shield_large_y/2 &&
				bullets[index].position.z < shields[loop].position.z+shield_large_z/2 &&
				bullets[index].position.z > shields[loop].position.z-you_large_z/2
			){
				bullets[index].position.y -= 10;
				clean(bullets[index]);
			}
		}

	}
}


function ennemyMove(){
	//1 tick = 1 frame
	if(tickX == 0){
		//go right
		left = false;
		ennemyYdown();
	}
	if(tickX == 200){
		//go left
		left = true;
		ennemyYdown();
	}		

	if(left){
		//move left & decrement
		for(var i=0; i<opponents.length; i++){
			opponents[i].position.x -= 0.01;
		}
		tickX--;
	} else {
		//move right & increment
		for(var i=0; i<opponents.length; i++){
			opponents[i].position.x += 0.01;
		}
		tickX++;
	}


	
}


function clean(object_given){
	scene.remove(object_given);
	object_given.geometry.dispose();
	object_given.material.dispose();
	//object_given.texture.dispose();
}

function killAnim(id_ennemy){
	if(
		killAnimation[id_ennemy] == true &&
		opponents[id_ennemy].position.z+opponents[id_ennemy].position.z/2 < plane.position.z
	){
		if(opponents.length == 1){
			console.log("win");
			youWin();
		} else {
			console.log("refresh");
			refreshEnnemyArray(id_ennemy);
		}
		
		score += opponents[id_ennemy].value;

		updateScore();

	} else {
		killAnimation[id_ennemy] = false;
	}

}



//removing dead ennemy by
//decrement all ennemies
function refreshEnnemyArray(place){
	ennemyHit = opponents[place];
	opponents.splice(place, 1);
	clean(ennemyHit);
	//ennemyHit.position.y -= 100;
}

function refreshShieldArray(place){
	shieldHit = shields[place];
	shields.splice(place, 1);
	clean(shieldHit);
}


function ennemyYdown(){
	for(var i=0; i<opponents.length; i++){
		opponents[i].position.y -= 0.1;
	}
}

function keyDown(event) {
	keyboard[event.keyCode] = true;
}

function keyUp(event) {
	keyboard[event.keyCode] = false;
}



function updateScore(){
	$("#score").html(score);
}

function addElement(elemID, text){
	newElem = document.createElement("div");
	var newContent = document.createTextNode(text);
	
	newElem.appendChild(newContent);
	document.body.insertBefore(newElem, currentDiv);
	newElem.id = elemID;
}



window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;