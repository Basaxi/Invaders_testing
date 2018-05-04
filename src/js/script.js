var scene, camera, renderer, you, ennemy, line1, x_ennemy, z_global, y_ennemy, planeBuffer, plane, planeMat, light;
var bullet_x = 0.1; var bullet_y = 0.8; var bullet_z = 0.01;
var ennemy_large_x = 1; var ennemy_large_y = 0.5; var ennemy_large_z = 0.3; var ennemy_large_x2 = 2;
var you_large_x = 1; var you_large_y = 0.5; var you_large_z = 0.3;
var shield_large_x = 1.2; var shield_large_y = 0.3; var shield_large_z = 0.3;
var tickX, tickY, left;
var frontEnnemy;
var planeMenu;
var ennemy = new Object();
var y_min;
var newElem;
var levelmax = 1;
var currentLevel = 1;
var ennemyPoint = 1; var totalP = 0;
var currentDiv = document.getElementById("base");
var score = 0;
var vitesseTir = 50;
var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
left = true;
tickX = 400;
tickY = 2;
z_global = -10;
var keyboard = {};
var follow = true;
var opponents = [];
var shields = [];
var move = true;
var toLoad;
var killAll = false;
var nbLoaded;
var killAnimation = [];
var bullets = [];
var enBullets = [];
var enSelected = [];
var loaded = false;
var sound;
var en;
var play = false;
var anim = 0; var inc = 0;



var modelEnnemytxt = '{'+
	'"ennemies": ['+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"},'+
		'{"num": "0", "name": "sbire", "value": "1", "hp": "1"}'+
	']'+
'}';
var modelEnnemy = JSON.parse(modelEnnemytxt);

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function ennemyRandom(){
	return modelEnnemy.ennemies[getRandomInt(2)];
}


function init() {
	$("#popup").hide();
	$("#score").hide();
	$("#menu").hide();
	initBase();
	createMenu();
}

function createMenu(){
	$("#menu").html(
		"<form  action=\"javascript:startGame();\"><button id=\"start\" type=\"submit\">Start the game</button></form></br>"
	).show();

}

function startGame(){
	$("#menu").hide();
	initLevel(levelmax);
	for(var p=0; p<enSelected.length; p++){
		scene.remove(enSelected[p]);
	}
	clean(planeMenu);
	$("#detailsEN").html("");
	playMenu = false;
	animate();
}


function initBase(){
	var manager = new THREE.LoadingManager();
	manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
		loaded = false;
		toLoad = itemsLoaded;
		nbLoaded = itemsTotal;
		console.log("loaded "+itemsLoaded+" total "+itemsTotal);
		console.log("loading :"+url);
	};

	manager.onLoad = function ( ) {
		if(toLoad = nbLoaded){
			loaded = true;
			for(var o =0; o<enSelected.length;o++){
				scene.add(enSelected[o]);
			}
			enSelected[0].text = "<h1>Sbire Miku</h1> the most frequent ennemy </br> HP: 1 </br> Point: 1 </br> Apparition : 100%";
			enSelected[1].text = "<h1>Pacman</h1> our glorious hero";
			$("#detailsEN").html(enSelected[0].text);
			playMenu=true;
			animMenu();
	
		}
		console.log( 'Loading complete!');

	};
	manager.onError = function ( url ) {

		console.log( 'There was an error loading ' + url );

	};
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
	THREEx.Screenshot.bindKey(renderer);
	renderer.setSize(width, height); //window's size
	document.body.appendChild(renderer.domElement);
	light  = new THREE.AmbientLight();
	light.position.set(0,0,5);
	scene.add(light);
	planeMenu = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(40, 30, 32),
		new THREE.MeshPhongMaterial({
			color: 0x741B47,
			side: THREE.DoubleSide
		})
	);
	planeMenu.position.set(0,0,-5);
	scene.add(planeMenu);
	var listener = new THREE.AudioListener();
	camera.add(listener);
	sound = new THREE.Audio(listener);
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load('src/medias/music/background.mp3', function(buffer){
		sound.setBuffer(buffer);
		sound.setLoop(true);
		sound.setVolume(0.5);
		sound.play();
	});
	camera.position.x = 0 ;
	camera.position.z = 0;
	camera.position.y = 0;
	$("#music").html("<form action=\"javascript:songManager();\"><button id=\"enable\">Music ON / OFF</button> ")
	var ob = new THREE.MTLLoader(manager)
	.setPath( 'src/medias/models/miku/' )
	.load( 'miku.mtl', function ( materials ) {
		materials.preload();
		var obj = new THREE.OBJLoader();
		obj.setMaterials( materials );
		obj.setPath( 'src/medias/models/miku/' );
		obj.load( 'miku.obj', function ( object ) {
				object.scale.x = 0.1;
				object.scale.y = 0.1;
				object.scale.z = 0.1;
				object.name = "miku"
				enSelected.push(object);
				object.position.set(1,0,-2);
		});
	});

	ob = new THREE.MTLLoader(manager)
	.setPath( 'src/medias/models/blob/' )
	.load( 'blob.mtl', function ( materials ) {
		materials.preload();
		var obj = new THREE.OBJLoader();
		obj.setMaterials( materials );
		obj.setPath( 'src/medias/models/blob/' );
		obj.load( 'blob.obj', function ( object ) {
				object.scale.x = 0.2;
				object.scale.y = 0.2;
				object.scale.z = 0.2;
				object.name = "blob2"
				enSelected.push(object);
				object.position.set(5,0,0);
		});
	});
}

function songManager(){
	if(sound.isPlaying){
		sound.pause();
	} else {
		sound.play();
	}
}

function animMenu(){
	if(playMenu){;
		requestAnimationFrame(animMenu);
		stats.begin();
		if(anim == 600){
			anim = 0;
			enSelected[inc].position.y = 5;
			if(inc < 1){
				inc++;
			} else {
				inc = 0;
			}
			$("#detailsEN").html(enSelected[inc].text);
			enSelected[inc].position.set(1,0,-2);
		} else {
			anim++;
		}

		enSelected[inc].rotation.y += 0.01;
		stats.end();
		renderer.render(scene, camera)
	}
}

function initLevel(level){
	console.log("Création du level...")
	score = 0;
	killAll = false;
	move = true;
	var floorTexture = new THREE.ImageUtils.loadTexture( 'src/medias/images/PIA12348.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
	var floorMaterial2 = new THREE.MeshBasicMaterial({ map: floorTexture, side: THREE.DoubleSide });
	var floorGeometry2 = new THREE.SphereGeometry(50, 100, 100);
	var floor2 = new THREE.Mesh(floorGeometry2, floorMaterial2);
	floor2.position.set(0,20,-20);
	floor2.rotation.x = 45;
	scene.add(floor2);
	floorTexture.repeat.set( 1, 1 ); 
	//scene.add(plane);
	
	
	ennemy.canShoot = vitesseTir;
	initHero();
	initProtect();
	initEnnemy(level);
	$("#score").html("score: "+score).show();
}


function deleteScene(){
	you.kill();
	opponents.forEach(function(element){
		scene.remove(element);
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
	$("#popup").dialog("close");
	initLevel(currentLevel);
    play=true;
    requestAnimationFrame(animate);
}



function restartlevel(){
	deleteScene();
}

function youWin(){
	totalP += score;
	if(vitesseTir > 10){
		vitesseTir -= 10;
	}
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
	console.log("Création du héros...");
	new THREE.MTLLoader()
		.setPath( 'src/medias/models/blob/' )
		.load( 'blob.mtl', function ( materials ) {
			materials.preload();
			var obj = new THREE.OBJLoader();
			obj.setMaterials( materials );
			obj.setPath( 'src/medias/models/blob/' );
			obj.load( 'blob.obj', function ( object ) {
					you = object;
					you.canShoot = 0;
					you.position.set(0, -10, z_global); //placing hero
					you.rotation.set(45,0,0);
					you.name = "you";
					you.kill = function(){
						console.log("hit");
						scene.remove(you);
						play = false;
						$("#popup").html("you loose <form action=\"javascript:restartlevel();\"><button type=\"submit\" id=\"restartlvl\">retry</button></form>");
						$("#popup").dialog();
					}
					you.scale.x = 0.5;
					you.scale.y = 0.5;
					you.scale.z = 0.5;
					scene.add( you );
				});
		});
	
	play = true;
}



function initProtect(){
	var x_shield = -4;
	var briquetexture = new THREE.ImageUtils.loadTexture( 'src/medias/images/brique.jpg' );
	briquetexture.wrapS = briquetexture.wrapT = THREE.RepeatWrapping;
	var briqueMat = new THREE.MeshBasicMaterial({ map: briquetexture, side: THREE.DoubleSide });
	for(var i=0; i<5; i++){
		shields.push(
			new THREE.Mesh(
				new THREE.BoxBufferGeometry(shield_large_x, shield_large_y, shield_large_z),
				briqueMat
			)
		);
		shields[i].hp = 8;
		shields[i].position.set(x_shield,-8, z_global);
		x_shield += 3;
		scene.add(shields[i]);
	}
}

function initEnnemy(level){
	var manager = new THREE.LoadingManager();
	manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
		loaded = false;
		toLoad = itemsLoaded;
		nbLoaded = itemsTotal;
	};

	manager.onLoad = function ( ) {
		if(toLoad = nbLoaded){
			var o = 0;
			for(var i = 0; i<50; i++){
				if(i == o+10){
					o += 10;
					y_ennemy -= 0.7;
					x_ennemy = -6.5;
				}

				killAnimation[i] = false;
				opponents[i].value = parseInt(thisEn.value);
				opponents[i].position.set(x_ennemy, y_ennemy, z_global);
				x_ennemy += 2;
				scene.add(opponents[i]);
			}
			
	
		}
		console.log( 'Loading complete!');

	};
	manager.onError = function ( url ) {

		console.log( 'There was an error loading ' + url );

	};
	var nbEn = level*10;
	x_ennemy = -6.5;
	y_ennemy = 5;
	for (i = 0; i < 50; i++) {
		var thisEn = ennemyRandom();
		console.log(thisEn);
		console.log(thisEn.color);
		var color = thisEn.color;
		
		if(thisEn.name == "sbire"){
			var ob = new THREE.MTLLoader(manager)
			.setPath( 'src/medias/models/miku/' )
			.load( 'miku.mtl', function ( materials ) {
				materials.preload();
				var obj = new THREE.OBJLoader();
				obj.setMaterials( materials );
				obj.setPath( 'src/medias/models/miku/' );
				obj.load( 'miku.obj', function ( object ) {
						object.scale.x = 0.1;
						object.scale.y = 0.1;
						object.scale.z = 0.1;
						object.rotation.x = 45;
						object.name = "ennemy"+i;
						opponents.push(object);
				});
			});
		} else {
			ob = new THREE.MTLLoader(manager)
			.setPath( 'src/medias/models/blob/' )
			.load( 'blob.mtl', function ( materials ) {
				materials.preload();
				var obj = new THREE.OBJLoader();
				obj.setMaterials( materials );
				obj.setPath( 'src/medias/models/blob/' );
				obj.load( 'blob.obj', function ( object ) {
						object.scale.x = 0.2;
						object.scale.y = 0.2;
						object.scale.z = 0.2;
						object.name = "ennemy"+i;
						opponents.push(object);
				});
			});
		}
		
		
	}
	
}

function help(){
	$("#popuphelp").html("<h1>Les raccourcis :</h1> mouvement du vaisseau Pacman avec les flèches gauche et droite </br> 'f' pour le fullscreen </br> 'p' pour faire un screenshot </br> Numpad 0 et 1 pour changer la vue de la caméra </br> 'i': permet de freezer les aliens </br> 'k': permet de tuer tout les aliens </br> 'h' pour fermer ce message");
	$("#popuphelp").dialog();
}

function animate() {
	stats.begin();
	if(!play) return; //pause
	requestAnimationFrame(animate);
	if(follow){
		camera.position.z = -8;
		camera.position.y = -15;
		camera.position.x = you.position.x;
		camera.lookAt(you.position);
	}
	if(killAll){
		for(var i=0; i<opponents.length-1; i++){
			scene.remove(opponents[i]);
		}
		youWin();
	}
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
	if (keyboard[96]){ //0
		follow = true;
		camera.position.z = -8;
		camera.position.y = -15;
	}
	if (keyboard[97]){ //1
		follow = false;
		camera.position.set(0,-16,-4);
	} 
	if(keyboard[73]){
		if(move){
			move =false;
		} else {
			move = true;
		}
		
	}
	if(keyboard[75]){
		killAll = true;
	}
	if(keyboard[72]){
		help();
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
			you.position.y+0.5,
			you.position.z
		);


		bullet.velocity = new THREE.Vector3(0, 0.2, 0); //bullet's speed
		bullet.alive = true; //bullet still active
		setTimeout(function() {
			bullet.alive = false; //bullet inactive
			scene.remove(bullet); //deleting bullet
		}, 5000);
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
			frontEnnemy.position.x-0.5,
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
		ennemy.canShoot = vitesseTir; 
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
			if(move){
				enBullets[index].position.y -= 10;
				clean(enBullets[index]);
				you.kill();
				continue;
			}
			
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
				bullets[index].position.x-bullet_x/2 >= opponents[loop].position.x-ennemy_large_x2/2 && 
				bullets[index].position.x+bullet_x/2 <= opponents[loop].position.x+ennemy_large_x/2 &&
				bullets[index].position.y+bullet_y/2 > opponents[loop].position.y-ennemy_large_y/2 &&
				bullets[index].position.y+bullet_y/2 < opponents[loop].position.y+ennemy_large_y/2 &&
				bullets[index].position.z < opponents[loop].position.z+ennemy_large_z/2 &&
				bullets[index].position.z > opponents[loop].position.z-ennemy_large_z/2 
			){
				bullets[index].position.set(-100,-100,-100);
				killAnimation[loop] = true;
				clean(bullets[index]);
				killAnim(loop);
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
	if(move){
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
		opponents[id_ennemy].position.z+opponents[id_ennemy].position.z/2 < -12
	){
		if(opponents.length == 1){
			youWin();
		} else {
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
	scene.remove(ennemyHit);
}

function refreshShieldArray(place){
	shieldHit = shields[place];
	shields.splice(place, 1);
	clean(shieldHit);
}


function ennemyYdown(){

	for(var i=0; i<opponents.length; i++){
		if(opponents[i].position.y <= you.position.y){
			you.kill();
		}
		opponents[i].position.y -= 0.5;
	}
}

function keyDown(event) {
	keyboard[event.keyCode] = true;
}

function keyUp(event) {
	keyboard[event.keyCode] = false;
}



function updateScore(){
	$("#score").html("score: "+score);
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