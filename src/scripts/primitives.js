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



const geometryPoint = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-5, 0, 0)]);
const materialPoint = new THREE.PointsMaterial({
    size: 0.1,
    color: 0xff0000
});
const points = new THREE.Points(geometryPoint, materialPoint);
scene.add(points)

const geometryPoint2 = new THREE.BufferGeometry()
geometryPoint2.setAttribute('position', new THREE.Float32BufferAttribute([-4, 1, 0, -4, -1, 0], 3));
geometryPoint2.setAttribute('color', new THREE.Float32BufferAttribute([1, 0, 1, 0, 1, 1], 3));
const materialPoint2 = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true
});
const points2 = new THREE.Points(geometryPoint2, materialPoint2);
scene.add(points2)


const geometryLine = new THREE.BufferGeometry().setFromPoints(
    [
        new THREE.Vector3(-3, -2, 0),
        new THREE.Vector3(-3, 2, 0)
    ]
);
const materialLine = new THREE.LineBasicMaterial({
    color: 0x0000ff
});
const line = new THREE.Line(geometryLine, materialLine);
scene.add(line);


const geometryPlane = new THREE.PlaneBufferGeometry(1, 2, 32);
const materialPlane = new THREE.MeshBasicMaterial({
    color: 0xffff00
});
const plane = new THREE.Mesh(geometryPlane, materialPlane);
plane.position.set(3,0,0)
scene.add(plane);



const shapeL = new THREE.Shape();
shapeL.moveTo( -1, 0 ); 
shapeL.lineTo( -1, 1 );
shapeL.lineTo( -0.9, 1 );
shapeL.lineTo( -0.9, 0.1 );
shapeL.lineTo( -0.5, 0.1 );
shapeL.lineTo( -0.5, 0 ); 
shapeL.lineTo( -1, 0 ); 

const shapeE = new THREE.Shape();
shapeE.moveTo( 0, 0 ); 
shapeE.lineTo( 0, 1 );
shapeE.lineTo( 0.5, 1 );
shapeE.lineTo( 0.5, 0.9 );
shapeE.lineTo( 0.1, 0.9 );
shapeE.lineTo( 0.1, 0.55); 
shapeE.lineTo( 0.5, 0.55); 
shapeE.lineTo( 0.5, 0.45); 
shapeE.lineTo( 0.1, 0.45); 
shapeE.lineTo( 0.1, 0.1);
shapeE.lineTo( 0.5, 0.1);
shapeE.lineTo(0.5, 0 ); 

const shapeO = new THREE.Shape();
shapeO.moveTo( 1.2, 0 );  
shapeO.lineTo(1.2, 1 ); 
shapeO.lineTo(2, 1 ); 
shapeO.lineTo(2, 0 ); 
shapeO.lineTo(1.2, 0 );

shapeO.holes.push(
    new THREE.Path(
        [
            new THREE.Vector2(1.3, 0.1),
            new THREE.Vector2(1.3, 0.9),
            new THREE.Vector2(1.9, 0.9),
            new THREE.Vector2(1.9, 0.1),
            new THREE.Vector2(1.3, 0.1),
        ]
    )
)


var geometryShape = new THREE.ShapeBufferGeometry( [shapeL,shapeE,shapeO] );
var materialShape = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var meshShape = new THREE.Mesh( geometryShape, materialShape ) ;
meshShape.position.set(0,-0.6,0)
scene.add(meshShape);



var extrudeSettings = { amount: 0.3, bevelEnabled: false};
var geometryExtrude = new THREE.ExtrudeBufferGeometry( [shapeL,shapeE,shapeO], extrudeSettings );
var meshShape2 = new THREE.Mesh( geometryExtrude, new THREE.MeshBasicMaterial( { color: 0xfff0ff } ) );
meshShape2.position.set(0,0.6,0)
scene.add(meshShape2);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// controls
const controls = new OrbitControls( camera, renderer.domElement );  

const animate = function () {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();