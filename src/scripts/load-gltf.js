import * as THREE from "three";
import { OrbitControls } from "../lib/controls/OrbitControls";
import "../style/index.less";

import { GLTFLoader } from "../lib/loaders/GLTFLoader.js";
import { RGBELoader } from "../lib//loaders/RGBELoader.js";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.getElementById("renderCanvas"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath("assets/textures/")
    .load("syferfontein_18d_clear_1k.hdr", function (texture) {
        var pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        var envMap = pmremGenerator.fromEquirectangular(texture).texture;

        //scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();

        // model
        var loader = new GLTFLoader().setPath("assets/models/");
        loader.load("scene.gltf", function (gltf) {
            scene.add(gltf.scene);
        });
    });

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 200, 300);
camera.lookAt(new THREE.Vector3(0, 300, 0));
// controls
const controls = new OrbitControls(camera, renderer.domElement);

const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

animate();
