import * as THREE from 'three';
import {
    OrbitControls
} from '../lib/controls/OrbitControls'
import '../style/index.less';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.getElementById("renderCanvas")
});
renderer.setSize(window.innerWidth, window.innerHeight);


var lightAm = new THREE.AmbientLight("#DFDFDF", 0.4);
scene.add(lightAm);

var lightDirect = new THREE.DirectionalLight(0xffffff, 1);
lightDirect.position.set(50, 50, -50);
lightDirect.castShadow = true;
lightDirect.shadow.mapSize.width = 1024;
lightDirect.shadow.mapSize.height = 1024;
lightDirect.shadow.camera.near = 1;
lightDirect.shadow.camera.far = 100;
scene.add(lightDirect);



const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 50, 50);

// controls
const controls = new OrbitControls(camera, renderer.domElement);

var cubes=[];
addCube(0, 5, 0);
addCube(30, 5, -10);
addGround();

const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};



function addCube(x, y, z) {
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshPhongMaterial({
        color: 0xC7FFFF
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    cube.castShadow = true;
    cubes.push(cube);
    scene.add(cube);
}

function addGround() {
    //ground
    var geometry = new THREE.PlaneGeometry(200, 200, 2);
    var material = new THREE.MeshPhongMaterial({
        color: '#C7DAFF',
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);
}

animate();


// 点击交互逻辑
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
renderer.domElement.addEventListener("mousedown", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(cubes, true);
    if (intersects.length > 0) {
        var obj = intersects[0].object;
        obj.material.color.set("#ff0000");
        obj.material.needsUpdate= true;
    }
})