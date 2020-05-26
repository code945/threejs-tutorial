import * as THREE from 'three';
import {OrbitControls} from '../lib/controls/OrbitControls'
import '../style/index.less';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias:true,
    canvas: document.getElementById("renderCanvas")
});
renderer.setSize(window.innerWidth, window.innerHeight);

var font;
var loader = new THREE.FontLoader();
loader.load('assets/fonts/FZLanTingHeiS-L-GB_Regular.json', function (response) {
    font = response;

    let textGeo = new THREE.TextGeometry("THREE.JS", {
        font: font,
        size: 2.5,
        height: 0.2,
    });
    let mesh = new THREE.Mesh(textGeo, new THREE.MeshLambertMaterial({color: '#2891FF',}));
    mesh.position.set(-11,0,0)
    scene.add(mesh); 

    let textGeo2 = new THREE.TextGeometry("知多少", {
        font: font,
        size: 2,
        height: 0.5,
    });

    let mesh2 = new THREE.Mesh(textGeo2, new THREE.MeshLambertMaterial({color: '#fefefe',}));
    mesh2.position.set(3,-4,0)
    scene.add(mesh2); 

});
 
var lightAm = new THREE.AmbientLight("#ffffff",0.9);
scene.add(lightAm);

var lightDirect = new THREE.DirectionalLight(0xffffff, 0.3);
lightDirect.position.set( 0, 0,50);
scene.add(lightDirect);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

// controls
const controls = new OrbitControls( camera, renderer.domElement );  

const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate(); 