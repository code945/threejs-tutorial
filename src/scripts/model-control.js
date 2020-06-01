import * as THREE from 'three';
import '../style/index.less';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({
    antialias: true,
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

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(10, 30, 50);
camera.lookAt(cube.position)
const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();


renderer.domElement.addEventListener("mousewheel", (event) => {
    var scaleFactor = 0.001; //鼠标滚轮控制的缩放强度系数
    var scale = 1 + event.wheelDelta * scaleFactor; //缩放倍数
    cube.scale.multiplyScalar(scale)
})

// let dragTarget = null; //拖拽对象
let raycaster = new THREE.Raycaster(); //射线
let mouse = new THREE.Vector2(); //鼠标位置
// let hit = new THREE.Vector3(); //射线在参考面上的拾取点
// let plane = new THREE.Plane(); //拖拽参考面
// plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(), cube.position);
// //let helper = new THREE.PlaneHelper( plane, 50, 0xffff00 ); //拖拽参考面的可视化帮助类
// //scene.add( helper );//添加拖拽参考面的可视化帮助类到场景
// renderer.domElement.addEventListener("mousedown", (event) => {
//     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//     raycaster.setFromCamera(mouse, camera);
//     let intersects = raycaster.intersectObjects([cube], true);
//     if (intersects.length > 0) {
//         dragTarget = intersects[0].object;
//     }
// })


// renderer.domElement.addEventListener("mousemove", (event) => {
//     if (dragTarget) {
//         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
//         raycaster.setFromCamera(mouse, camera);
//         raycaster.ray.intersectPlane(plane, hit);
//         if (hit) {
//             cube.position.copy(hit);
//             console.log(hit)
//         }
//     }

// })

// renderer.domElement.addEventListener("mouseup", (event) => {
//     dragTarget = null;
// })

let lastX = null;
renderer.domElement.addEventListener("mousedown", (event) => {
    lastX = event.clientX;
})

renderer.domElement.addEventListener("mousemove", (event) => {
    if (lastX) {
        let delta = event.clientX - lastX
        cube.rotateY(delta * 0.01)
        lastX = event.clientX;
    }

})

renderer.domElement.addEventListener("mouseup", (event) => {
    lastX = null;
})