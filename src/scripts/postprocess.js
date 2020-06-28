import * as THREE from "three";
import { OrbitControls } from "../lib/controls/OrbitControls";
import { EffectComposer } from "../lib/postprocessing/EffectComposer.js";
import { RenderPass } from "../lib/postprocessing/RenderPass.js";
import { CubeTexturePass } from "../lib/postprocessing/CubeTexturePass.js";
import { ShaderPass } from "../lib/postprocessing/ShaderPass.js";
import { ClearPass } from "../lib/postprocessing/ClearPass.js";
import { BlurPass } from "../lib/postprocessing/BlurPass.js";
import { CopyShader } from "../lib/shaders/CopyShader.js";
import { GLTFLoader } from "../lib/loaders/GLTFLoader.js";
import { RGBELoader } from "../lib//loaders/RGBELoader.js";
import { GUI } from "../lib/dat.gui.module";
import "../style/index.less";
var params = {
    exposure: 1.0,
    blur: 0,
    cubeTexturePassOpacity: 1.0,
};

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.getElementById("renderCanvas"),
});
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();

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

const loader = new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath("assets/textures/")
    .load("syferfontein_18d_clear_1k.hdr", function (texture) {
        let pmremGenerator = new THREE.PMREMGenerator(renderer);
        pmremGenerator.compileEquirectangularShader();

        let envMap = pmremGenerator.fromEquirectangular(texture).texture;

        let loader = new GLTFLoader().setPath("assets/models/");
        loader.load("scene.gltf", function (gltf) {
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.material.envMap = envMap;
                }
            });
            scene.add(gltf.scene);
        });

        cubeTexturePassP.envMap = envMap;
        animate();
        pmremGenerator.dispose();
    });

window.addEventListener("resize", onWindowResize, false);

var gui = new GUI();
gui.add(params, "exposure", 0, 2, 0.01);
gui.add(params, "blur", 0, 100);
gui.add(params, "cubeTexturePassOpacity", 0, 1);
gui.open();
gui.domElement.parentElement.style.zIndex = 100;

const composer = new EffectComposer(renderer);
// 清屏背景色pass
const clearPass = new ClearPass(0xff0000, 1);
composer.addPass(clearPass);
// 天空盒pass
const cubeTexturePassP = new CubeTexturePass(camera);
composer.addPass(cubeTexturePassP);
// 模糊处理pass
const blurPass = new BlurPass(
    1,
    new THREE.Vector2(renderer.domElement.width, renderer.domElement.height)
);
composer.addPass(blurPass);
// 场景渲染
const renderPass = new RenderPass(scene, camera);
renderPass.clear = false;
composer.addPass(renderPass);
// copy内容到屏幕输出
const copyPass = new ShaderPass(CopyShader);
composer.addPass(copyPass);

function onWindowResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
    composer.setSize(width, height);
}

function animate() {
    requestAnimationFrame(animate);
    // 设置模糊
    blurPass.blur = params.blur;
    // 设置明暗
    renderer.toneMappingExposure = params.exposure;
    // 设置天空盒透明度
    cubeTexturePassP.opacity = params.cubeTexturePassOpacity;
    // 渲染
    composer.render();
}
