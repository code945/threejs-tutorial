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


const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 250, 10);

// controls
const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.PlaneGeometry(200, 200, 2); 
const material = new THREE.RawShaderMaterial({ 
    uniforms: {
        ratio: {
            value: 0.0
        }
    },
    vertexShader: document.getElementById('vertexShader').textContent,
    fragmentShader: document.getElementById('fragmentShader').textContent, 
});
const plane = new THREE.Mesh(geometry, material);
plane.rotateX(-Math.PI / 2); 
scene.add(plane);

let next = 0;
const animate = function () {
    requestAnimationFrame(animate);
    next = next + 0.01;
    if (next > 1)
        next = 0;
    plane.material.uniforms.ratio.value = next;
    renderer.render(scene, camera);
};



animate();