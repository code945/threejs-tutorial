import * as THREE from 'three';
import {
    OrbitControls
} from '../lib/controls/OrbitControls'
import '../style/index.less';

import {
    GLTFLoader
} from '../lib/loaders/GLTFLoader.js';
import {
    RGBELoader
} from '../lib//loaders/RGBELoader.js';

const scene = new THREE.Scene();
let mixer = null;
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    canvas: document.getElementById("renderCanvas")
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

var pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader()
    .setDataType(THREE.UnsignedByteType)
    .setPath('assets/textures/')
    .load('syferfontein_18d_clear_1k.hdr', function (texture) {

        var envMap = pmremGenerator.fromEquirectangular(texture).texture;

        //scene.background = envMap;
        scene.environment = envMap;

        texture.dispose();
        pmremGenerator.dispose();


        // model
        var loader = new GLTFLoader().setPath('assets/models/');
        loader.load('scene.gltf', function (gltf) {
            var object = gltf.scene;
            //获取gltf中的所有分段动画
            var clips = gltf.animations;
            if (clips && clips.length) {
                //创建mixer
                mixer = new THREE.AnimationMixer(object);
                for (var i = 0; i < clips.length; i++) {
                    //当前动画段
                    var take = clips[i];
                    //创建播放器 AnimationAction 并播放
                    mixer.clipAction(take).play();
                }
            }
            scene.add(gltf.scene);
            animate();
        });

    });


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 200, 300);
camera.lookAt(new THREE.Vector3(0, 300, 0));
// controls
const controls = new OrbitControls(camera, renderer.domElement);
var clock = new THREE.Clock();
const animate = function () {
    requestAnimationFrame(animate);
    controls.update()
    mixer.update(clock.getDelta())
    renderer.render(scene, camera);
};