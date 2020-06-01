import * as THREE from 'three';
import {
    OrbitControls
} from '../lib/controls/OrbitControls'
import '../style/index.less';

import TWEEN from '@tweenjs/tween.js';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    antialias:true,
    alpha: true,
    canvas: document.getElementById("renderCanvas")
});
renderer.setSize(window.innerWidth, window.innerHeight);

var lightAm = new THREE.AmbientLight("#DFDFDF", 0.4);
scene.add(lightAm);

var lightDirect = new THREE.DirectionalLight(0xffffff, 1);
lightDirect.position.set(50, 50, -50); 
scene.add(lightDirect);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0,2,5);
 // controls
const controls = new OrbitControls(camera, renderer.domElement);


var tweenPosition =new TWEEN.Tween(cube.position)
.to({ x: cube.position.x+3, y: 0, z: cube.position.z }, 1500)
.easing(TWEEN.Easing.Back.Out)
.start();

const animate = function () {
    requestAnimationFrame(animate);

    TWEEN.update();

    renderer.render(scene, camera);
};

animate();

