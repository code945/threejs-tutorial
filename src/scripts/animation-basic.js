import * as THREE from 'three';
import '../style/index.less';

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

let step = 0;
const animate = function () {
    requestAnimationFrame(animate);

    step += 0.01;
    cube.position.x = Math.cos(step)
    cube.position.y = 2*Math.abs(Math.sin(step)); 
    cube.rotation.y += 0.03;

    renderer.render(scene, camera);
};

animate();