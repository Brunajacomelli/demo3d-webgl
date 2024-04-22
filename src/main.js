import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';
//import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let container, stats; 
let camera, scene, renderer;
let cameraControls
let grid;
let tractor;
let tractorSpeed=5;

const clock = new THREE.Clock();

// atenção na possibilidade de async function

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

//CENA
scene = new THREE.Scene();
scene.background = new THREE.Color( 0xB8E1FC );
scene.fog = new THREE.FogExp2( 0xd8d9da, 0.00035 );

//CAMERA
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 150, 500 );
scene.add( camera );

//LUZES
scene.add( new THREE.AmbientLight( 0x666666, 3 ) ); //adciona luz ambiente - cor e intensidade

const light = new THREE.DirectionalLight( 0xffffff, 7 ); //cria uma luz direcional - cor e intensidade da luz
light.position.set( 200, 450, 500 ); //define a posição da luz direcional, com coordenadas x, y e z

light.castShadow = true; //permite a projeção de sombras

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 512;

light.shadow.camera.near = 100;
light.shadow.camera.far = 1200;

light.shadow.camera.left = - 1000;
light.shadow.camera.right = 1000;
light.shadow.camera.top = 350;
light.shadow.camera.bottom = - 350;

scene.add( light );

//GROUND
const gt = new THREE.TextureLoader().load( 'textures/terrain/grasslight-big.jpg' );
const gg = new THREE.PlaneGeometry( 16000, 16000 );
const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, depthWrite: false, map: gt } );

const ground = new THREE.Mesh( gg, gm );
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set( 64, 64 );
ground.material.map.wrapS = THREE.RepeatWrapping;
ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.colorSpace = THREE.SRGBColorSpace;
ground.receiveShadow = true;
scene.add( ground );

//GRID
const groundSize = 16000
const numDivisions = 50; 
grid = new THREE.GridHelper( groundSize, numDivisions, 0x000000, 0x000000 );
grid.position.set(1, 1, 1);
grid.material.depthWrite = false;
grid.material.transparent = true;
scene.add( grid );

//OBJETO
const loader = new GLTFLoader().setPath( 'models/newtractor/' );
	loader.load( 'tractor.gltf', async function ( gltf ) {
    tractor = gltf.scene;

    // Modifique a escala do objeto aqui
    tractor.scale.set(50, 50, 50);        

    tractor.position.y = 0;

	// wait until the model can be added to the scene without blocking due to shader compilation
	await renderer.compileAsync( tractor, camera, scene );

scene.add( tractor );

render();
    } );


// RENDERER
renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
container.appendChild( renderer.domElement );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );


//CONTROLES DA CÂMERA
cameraControls = new OrbitControls( camera, renderer.domElement );
cameraControls.target.set( 0, 100, 0 );
cameraControls.update();
cameraControls.minPolarAngle = 0; // radians
cameraControls.maxPolarAngle = Math.PI/2; // radians


// STATS
stats = new Stats();
container.appendChild( stats.dom );

//EVENTS 
//window.addEventListener( 'resize', onWindowResize );
//events handlers
//SCREEN_WIDTH = window.innerWidth;
//SCREEN_HEIGHT = window.innerHeight;

renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
camera.updateProjectionMatrix();

}

function moveTractor() {
    const newX = tractor.position.x + tractorSpeed;
    
  // Verifica se a nova posição está dentro dos limites da grade
  if (newX < groundSize / 2) {
    tractor.position.x = newX; // Atualiza a posição do trator para a nova posição
    camera.position.x = newX; // Atualiza a posição da câmera para seguir o trator
}
}

function animate() {

    requestAnimationFrame( animate );
    render();
    stats.update();

    moveTractor()

    tractor.position.z += 0.5;
    camera.position.z += 0.5;

    }


function render() {

    renderer.render( scene, camera );

}

init();
animate();
