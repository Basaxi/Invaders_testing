var scene, camera, renderer, you, ennemy, line1, x_ennemy, z_global, y_ennemy, planeBuffer, plane, planeMat;
var bullet_x = 0.1; var bullet_y = 0.8; var bullet_z = 0.01;
var ennemy_large_x = 1; var ennemy_large_y = 1; var ennemy_large_z = 1;
var tickX, tickY, left;
left = true;
tickX = 200;
tickY = 2;
z_global = -10;
var keyboard = {};
var opponents = [];
var killAnimation = [];
var bullets = [];

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(70, 1920 / 1080, 0.1, 1000);
	plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry(40, 30, 32),
		new THREE.MeshBasicMaterial({
			color: 0x741B47,
			side: THREE.DoubleSide
		}));
	plane.position.set(0, 0, -12);
	scene.add(plane);
	//line1 = new THREE.Group();
	you = new THREE.Mesh(
		new THREE.BoxBufferGeometry(ennemy_large_x, ennemy_large_y, ennemy_large_z),
		new THREE.MeshBasicMaterial({
			color: 0x15F0E6,
			wireframe: false
		})
	); //create hero
	
	you.canShoot = 0;
	x_ennemy = -10;
	y_ennemy = 5;
	for (i = 0; i < 10; i++) {
		opponents.push(
			ennemy = new THREE.Mesh(
				new THREE.BoxBufferGeometry(ennemy_large_x, ennemy_large_y, ennemy_large_z),
				new THREE.MeshBasicMaterial({
					color: 0x11E821,
					wireframe: false
				})
			)
		);
		killAnimation[i] = false;
		opponents[i].position.set(x_ennemy, y_ennemy, z_global);
		//line1.add(opponents[i]);
		x_ennemy += 2;
		scene.add(opponents[i]);
	}
	//scene.add(line1); //adding ennemies
	you.position.set(0, -5, z_global); //placing hero
	scene.add(you); //adding hero
	renderer = new THREE.WebGLRenderer({
		antialias: true, //enable antialiasing
		preserveDrawingBuffer: true //enable screenshot
	});
	renderer.setSize(1280, 720); //window's size
	document.body.appendChild(renderer.domElement);
	animate();
}

function animate() {
	requestAnimationFrame(animate);
	
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
				scene.remove(bullets[index]);
				killAnimation[loop] = true;
				bullets[index].geometry.dispose();
				bullets[index].material.dispose();
				console.log("même X");
				continue;
			}

			killAnim(loop);
		}



	}
	//moving every frame
	ennemyMove();


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
		}, 1000);
		bullets.push(bullet);
		scene.add(bullet);
		you.canShoot = 50; //50frames until next shoot

	}
	if (you.canShoot > 0) you.canShoot--; //counting frames

	
	renderer.render(scene, camera);
}

function ennemyMove(){
	//1 tick = 1 frame
	if(tickX == 0){
		//go right
		left = false;
		ennemyYdown();
	}
	if(tickX == 100){
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

function killAnim(id_ennemy){
	if(
		killAnimation[id_ennemy] == true &&
		opponents[id_ennemy].position.z+opponents[id_ennemy].position.z/2 > plane.position.z
	){
		refreshEnnemyArray(id_ennemy);
	} else {
		killAnimation[id_ennemy] = false;
	}

}

//removing dead ennemy by
//decrement all ennemies
function refreshEnnemyArray(place){
	for(var i = place; i < opponents.length-place; i++){
		opponents[i] = opponents[i+1];
	}
	opponents.length--;
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

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.onload = init;