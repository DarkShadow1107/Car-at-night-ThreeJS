console.clear();

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { OrbitControls } from "three/addons/controls/OrbitControls";
import Threeasy from "threeasy";

// COLORS
const white = new THREE.Color(0xe9c46a);
const black = new THREE.Color(0x001219);
const red = new THREE.Color(0xe63946);
const blue = new THREE.Color(0x457b9d);

// CREATE
const createDirLight = (c = 0xffffff, s = 0.5) => {
	const directionalLight = new THREE.DirectionalLight(c, s);
	app.scene.add(directionalLight);
	return directionalLight;
};
const createPointLight = (c = 0xffffff, s = 0.5) => {
	const pointLight = new THREE.SpotLight(c, s);
	return pointLight;
};
const createSpotLight = (c = 0xffffff, s = 0.5, w = 0.3) => {
	const spotLight = new THREE.SpotLight(c, s);
	// console.log(spotLight)
	spotLight.position.set(0, 10, 0);
	spotLight.castShadow = true;

	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;

	spotLight.shadow.camera.near = 50;
	spotLight.shadow.camera.far = 40;
	spotLight.shadow.camera.fov = 10;

	spotLight.distance = 0;
	spotLight.angle = Math.PI * w;
	spotLight.penumbra = 1;
	spotLight.decay = 1;

	return spotLight;
};
const createLightPole = () => {
	const metal = new THREE.MeshPhysicalMaterial({
		color: 0x4a606d,
		roughness: 0.3,
		metalness: 1,
	});
	const geo = new THREE.CylinderGeometry(
		0.2, // radiusTop
		0.2, // radiusBottom
		100, // height
		16, // radialSegments
		1 // heightSegments
	);
	const mesh = new THREE.Mesh(geo, metal);
	return mesh;
};
const createMainSpotLight = () => {
	const spotLight = createSpotLight(blue, 120);
	spotLight.position.set(0, 10, 0);
	app.scene.add(spotLight);
	app.scene.add(spotLight.target);

	const lightPole = createLightPole();
	lightPole.position.set(6, 0, 0);
	app.scene.add(lightPole);

	// ANIMTION
	app.animator.add(() => {
		const spotlightTravel = 50;

		let newPos = spotLight.position.z - 0.4;
		if (newPos < -spotlightTravel) newPos = spotlightTravel;
		spotLight.position.z = newPos;
		spotLight.target.position.z = newPos;
		lightPole.position.z = newPos;
	});

	return spotLight;
};
const createWall = () => {
	let geo = new THREE.BoxGeometry(0.2, 2, 500, 1);
	let mat = new THREE.MeshStandardMaterial({ color: blue });
	let mesh = new THREE.Mesh(geo, mat);
	// mesh.rotation.x = -.5*Math.PI;
	mesh.position.set(5, -1, 0);
	mesh.recieveShadow = true;
	mesh.name = "wall";
	app.scene.add(mesh);

	mesh.material.normalMap = app.wood_nor;
	mesh.material.displacementMap = app.wood_dis;
	mesh.material.displacementScale = 0.05;
	mesh.material.roughnessMap = app.wood_rgh;
	mesh.material.needsUpdate = true;

	const speed = 0.003;
	app.animator.add(() => {
		mesh.material.normalMap.offset.y -= speed;
		mesh.material.roughnessMap.offset.y -= speed;
		mesh.material.displacementMap.offset.y -= speed;
		mesh.material.needsUpdate = true;
	});
	return mesh;
};
const createRoad = () => {
	let geo = new THREE.PlaneGeometry(10, 1000, 100, 1000);
	let mat = new THREE.MeshStandardMaterial({ color: black });
	let mesh = new THREE.Mesh(geo, mat);
	mesh.rotation.x = -0.5 * Math.PI;
	mesh.position.y = -1.5;
	mesh.recieveShadow = true;
	mesh.name = "road";
	app.scene.add(mesh);

	mesh.material.normalMap = app.wood_nor;
	mesh.material.displacementMap = app.wood_dis;
	mesh.material.displacementScale = 0.05;
	mesh.material.roughnessMap = app.wood_rgh;
	mesh.material.needsUpdate = true;

	const speed = 0.003;
	app.animator.add(() => {
		mesh.material.normalMap.offset.y -= speed;
		mesh.material.roughnessMap.offset.y -= speed;
		mesh.material.displacementMap.offset.y -= speed;
		mesh.material.needsUpdate = true;
	});
	return mesh;
};
const createCar = () => {
	app.car.traverse((item) => {
		item.castShadow = true;
		item.recieveShadow = true;

		if (item.name == "body") {
			item.material.color = blue;
		}
		if (item.name.includes("tyre")) {
			item.material.color = black;
		}
		if (item.name.includes("front") && item.name.includes("light")) {
			const light = createSpotLight(white, 75, 0.6);
			// console.log(light)

			if (item.name.includes("left")) {
				light.position.x = item.position.x - 0.8;
				light.target.position.x = item.position.x - 0.8;
			} else {
				light.position.x = item.position.x + 0.8;
				light.target.position.x = item.position.x + 0.8;
			}
			light.position.y = item.position.y - 0.25;
			light.position.z = item.position.z + 4.5;

			light.target.position.y = item.position.y - 1;
			light.target.position.z = item.position.z + 8;

			// const helper = new THREE.SpotLightHelper( light );
			// app.scene.add( helper );

			app.scene.add(light);
			app.scene.add(light.target);
			item.material.color = white;
			item.material.emissive = white;
		}
		if (item.name.includes("rear") && item.name.includes("light")) {
			const light = createPointLight(red, 1000);
			// console.log(light)

			if (item.name.includes("left")) {
				light.position.x = item.position.x - 0.8;
			} else {
				light.position.x = item.position.x + 0.8;
			}
			light.position.y = item.position.y;
			light.position.z = item.position.z - 3;

			// 	const sphereSize = 1;
			// const helper = new THREE.PointLightHelper( light, sphereSize );
			// app.scene.add( helper );

			item.material.color = red;
			item.material.emissive = red;
		}
	});
	app.scene.add(app.car);

	app.animator.add(() => {
		const t = app.clock.getElapsedTime();
		app.car.position.set(Math.sin(t * 30) * 0.02, Math.sin(t * 30) * 0.01, -3);
	});

	return app.car;
};

// SETUP
const setupCamera = () => {
	const zoom = 1;
	app.camera.position.x = -4 * zoom;
	app.camera.position.y = 1.2 * zoom;
	app.camera.position.z = 5 * zoom;
	app.camera.lookAt(0, 0, 2);
	app.animator.add(() => {
		frame++;
	});
};

// APP
const app = new Threeasy(THREE, {
	preload: {
		car: "https://assets.codepen.io/5946/car.glb",
		wood_nor: "https://assets.codepen.io/5946/wood_nor.jpg",
		wood_dis: "https://assets.codepen.io/5946/wood_dis.jpg",
		wood_rgh: "https://assets.codepen.io/5946/wood_rgh.jpg",
	},
	GLTFLoader,
	light: false,
});
let frame = -1;
// new OrbitControls(app.camera, app.renderer.domElement);
app.scene.background = new THREE.Color(black);

app.scene.fog = new THREE.Fog(black, 5, 45);

app.postload(() => {
	document.querySelector(".loading").style.opacity = 0;
	setupCamera();
	// const dirLight = createDirLight(white, 1.5);
	const spotLight = createMainSpotLight();
	const wall = createWall();
	const road = createRoad();
	const car = createCar();
});
