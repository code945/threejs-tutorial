import * as THREE from 'three';
import {
    OrbitControls
} from '../lib/controls/OrbitControls'
import '../style/index.less';

var color = new THREE.Color(); 
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

var cubes = [];
addCube(0, 5, 0, 101);
addCube(30, 5, -10, 202);
addGround();

const animate = function () {
    requestAnimationFrame(animate);
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
};



function addCube(x, y, z, id) {
    var geometry = new THREE.BoxGeometry(10, 10, 10);
    var material = new THREE.MeshBasicMaterial({
        color: color.setHex(id)
    });
    var cube = new THREE.Mesh(geometry, material);
    cube.name ="cube"+ id;
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
var mouse = new THREE.Vector2();
//初始化一个renderTarget
var pickingTexture = new THREE.WebGLRenderTarget( 1, 1 );
renderer.domElement.addEventListener("mousedown", (event) => {
    mouse.x = event.clientX;
	mouse.y = event.clientY;
    //设置相机为鼠标点的一个像素
    camera.setViewOffset(renderer.domElement.width, renderer.domElement.height, mouse.x * window.devicePixelRatio | 0, mouse.y * window.devicePixelRatio | 0, 1, 1);
    // 设置当前渲染目标对象
    renderer.setRenderTarget(pickingTexture);
    //渲染当前场景
    renderer.render(scene, camera);  
    //恢复相机尺寸
    camera.clearViewOffset();
    //创建 buffer容器
    var pixelBuffer = new Uint8Array(4);
    //读取颜色信息到buffer
    renderer.readRenderTargetPixels(pickingTexture, 0, 0, 1, 1, pixelBuffer);
    //获取颜色对应的id
    var id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | (pixelBuffer[2]);
    if(id>0 &&  scene.getObjectByName("cube"+ id))
    {
        //设置选中颜色
        var obj = scene.getObjectByName("cube"+ id);
        obj.material.color.set("#ff0000");
        obj.material.needsUpdate= true; 
    } 

})