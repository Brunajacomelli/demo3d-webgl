import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js';
//import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import Stats from 'three/addons/libs/stats.module.js';
//import { MD2CharacterComplex } from 'three/addons/misc/MD2CharacterComplex.js';
//import { Gyroscope } from 'three/addons/misc/Gyroscope.js';

//const controls = new OrbitControls( camera, renderer.domElement );
//const loader = new GLTFLoader();

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;

let container, stats;
let camera, scene, renderer;

/*const characters = [];
let nCharacters = 0;*/

let cameraControls;

const controls = {

    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false

};

const clock = new THREE.Clock();

	init();
	animate();

function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );



    // OBJETO
const manager = new THREE.LoadingManager();

const loader = new ThreeMFLoader( manager );
loader.load( './models/3mf/truck.3mf', function ( object ) {

object.rotation.set( - Math.PI / 2, 0, 0 ); // z-up conversion

object.scale.set(5, 5, 5);

object.position.y = 0;

object.traverse( function ( child ) {

    child.castShadow = false;

        } );

    scene.add( object );

    } );

    //

manager.onLoad = function () {

    render();

    };


// CAMERA

camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 4000 );
camera.position.set( 0, 150, 1300 );

// SCENE

scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
scene.fog = new THREE.Fog( 0xffffff, 2000, 4000 );

scene.add( camera );

// LIGHTS

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


//  GROUND

const gt = new THREE.TextureLoader().load( 'textures/terrain/grasslight-big.jpg' );
const gg = new THREE.PlaneGeometry( 16000, 16000 );
const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

const ground = new THREE.Mesh( gg, gm );
ground.rotation.x = - Math.PI / 2;
ground.material.map.repeat.set( 64, 64 );
ground.material.map.wrapS = THREE.RepeatWrapping;
ground.material.map.wrapT = THREE.RepeatWrapping;
ground.material.map.colorSpace = THREE.SRGBColorSpace;
// note that because the ground does not cast a shadow, .castShadow is left false
ground.receiveShadow = true;

scene.add( ground );

// RENDERER

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
container.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// STATS

stats = new Stats();
container.appendChild( stats.dom );

// EVENTS

window.addEventListener( 'resize', onWindowResize );
document.addEventListener( 'keydown', onKeyDown );
document.addEventListener( 'keyup', onKeyUp );

// CONTROLS

cameraControls = new OrbitControls( camera, renderer.domElement );
cameraControls.target.set( 0, 100, 0 );
cameraControls.update();
cameraControls.minPolarAngle = 0; // radians
cameraControls.maxPolarAngle = Math.PI/2; // radians


//GRID
const groundSize = 16000
const numDivisions = 50; 
const grid = new THREE.GridHelper( groundSize, numDivisions, 0x000000, 0x000000 );
grid.position.set(1, 1, 1);
scene.add( grid );


}

// EVENT HANDLERS

function onWindowResize() {

SCREEN_WIDTH = window.innerWidth;
SCREEN_HEIGHT = window.innerHeight;

renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
camera.updateProjectionMatrix();

}

function onKeyDown( event ) {

switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW': controls.moveForward = true; break;

    case 'ArrowDown':
    case 'KeyS': controls.moveBackward = true; break;

    case 'ArrowLeft':
    case 'KeyA': controls.moveLeft = true; break;

    case 'ArrowRight':
    case 'KeyD': controls.moveRight = true; break;

    // case 'KeyC': controls.crouch = true; break;
    // case 'Space': controls.jump = true; break;
    // case 'ControlLeft':
    // case 'ControlRight': controls.attack = true; break;

}

}

function onKeyUp( event ) {

switch ( event.code ) {

    case 'ArrowUp':
    case 'KeyW': controls.moveForward = false; break;

    case 'ArrowDown':
    case 'KeyS': controls.moveBackward = false; break;

    case 'ArrowLeft':
    case 'KeyA': controls.moveLeft = false; break;

    case 'ArrowRight':
    case 'KeyD': controls.moveRight = false; break;

    // case 'KeyC': controls.crouch = false; break;
    // case 'Space': controls.jump = false; break;
    // case 'ControlLeft':
    // case 'ControlRight': controls.attack = false; break;

}

}

//

function animate() {

requestAnimationFrame( animate );
render();

stats.update();

}

function render() {

/*const delta = clock.getDelta();

for ( let i = 0; i < nCharacters; i ++ ) {

    characters[ i ].update( delta );

}*/

renderer.render( scene, camera );

}