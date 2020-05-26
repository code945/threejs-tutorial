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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 20);

// controls
const controls = new OrbitControls(camera, renderer.domElement);

const animate = function () {
    requestAnimationFrame(animate);
    step += 0.01;
    cube.position.x = 2 + (1 * (Math.cos(step)));
    cube.position.y = 2 + (10 * Math.abs(Math.sin(step)));

    cube.rotation.x += 0.03;
    cube.rotation.y += 0.03;
    cube.rotation.z += 0.03;
    renderer.render(scene, camera);
};

var ambientLight, lightHemisphere, lightDirect, lightSpot, lightPoint,
    lightHemisphereHelper, lightDirectHelper, lightSpotHelper, lightPointHelper;
var cube;


initLights();

addCube();
addGround();
var step = 135;
var direction = 0;



function initLights() {

    ambientLight = new THREE.AmbientLight(0xF9CC14, 1);
    ambientLight.visible = false;
    scene.add(ambientLight);

    lightHemisphere = new THREE.HemisphereLight(0xCEE2FC, 0xffffff, 0.4);
    lightHemisphere.position.set(0, 200, -20);
    lightHemisphere.visible = false;
    scene.add(lightHemisphere);

    lightHemisphereHelper = new THREE.HemisphereLightHelper(lightHemisphere);
    scene.add(lightHemisphereHelper);
    lightHemisphereHelper.visible = false;


    lightDirect = new THREE.DirectionalLight(0xf2f2f2, 0.8); //设置平行光源
    lightDirect.position.set(20, 20, -20); //设置光源向量
    lightDirect.target.position.set(20, 0, 0)
    lightDirect.castShadow = true;
    //lightDirect.shadow.mapSize.width = 1024;
    //lightDirect.shadow.mapSize.height = 1024;
    //lightDirect.shadow.camera.near = 1;
    //lightDirect.shadow.camera.far = 100;
    scene.add(lightDirect); // 追加光源到场景
    //lightDirect.visible = false;

    lightDirectHelper = new THREE.DirectionalLightHelper(lightDirect);
    scene.add(lightDirectHelper);
    //lightDirectHelper.visible = false;


    lightSpot = new THREE.SpotLight(0xE9E9E9);
    lightSpot.position.set(0, 20, -20);
    lightSpot.castShadow = true;
    lightSpot.angle = Math.PI / 4;
    lightSpot.penumbra = 0.3;
    lightSpot.shadow.mapSize.width = 1024;
    lightSpot.shadow.mapSize.height = 1024;
    lightSpot.shadow.camera.near = 1;
    lightSpot.shadow.camera.far = 100;
    scene.add(lightSpot);
    lightSpot.visible = false;

    lightSpotHelper = new THREE.SpotLightHelper(lightSpot);
    scene.add(lightSpotHelper);
    lightSpotHelper.visible = false;

    lightPoint = new THREE.PointLight(0xE9E9E9, 0.9);
    lightPoint.position.set(0, 10, -5);
    lightPoint.castShadow = true;
    lightPoint.shadow.mapSize.width = 1024;
    lightPoint.shadow.mapSize.height = 1024;
    lightPoint.shadow.camera.near = 1;
    lightPoint.shadow.camera.far = 100;
    scene.add(lightPoint);
    lightPoint.visible = false;

    lightPointHelper = new THREE.PointLightHelper(lightPoint);
    scene.add(lightPointHelper);
    lightPointHelper.visible = false;

}

function changeambientLight() {
    ambientLight.visible = !ambientLight.visible;
}

function changeHemisphereLight() {
    lightHemisphere.visible = lightHemisphereHelper.visible = !lightHemisphere.visible;
}

function changeLight(flag) {
    if (flag == 0) {
        lightDirectHelper,
        lightSpotHelper,
        lightPointHelper
        lightDirect.visible = lightDirectHelper.visible = lightSpot.visible = lightSpotHelper.visible = false;
        lightPoint.visible = lightPointHelper.visible = true;
    }
    else if (flag == 1) {
        lightPoint.visible = lightPointHelper.visible = lightSpot.visible = lightSpotHelper.visible = false;
        lightDirect.visible = lightDirectHelper.visible = true;
    } else if (flag == 2) {

        lightPoint.visible = lightPointHelper.visible = lightDirect.visible = lightDirectHelper.visible = false;
        lightSpot.visible = lightSpotHelper.visible = true;
    }

}


function addCube() {
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 2, 0);
    cube.castShadow = true;
    scene.add(cube);
}

function addGround() {
    //ground
    var geometry = new THREE.PlaneGeometry(200, 200, 2);
    var material = new THREE.MeshPhongMaterial({
        color: '#eee',
        side: THREE.DoubleSide
    });
    var plane = new THREE.Mesh(geometry, material);
    plane.rotateX(-Math.PI / 2);
    plane.receiveShadow = true;
    scene.add(plane);
}


animate();