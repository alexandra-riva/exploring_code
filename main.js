import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

let container;
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let raycaster;
let canvasPanel;
let isInVR = false;

const tempMatrix = new THREE.Matrix4();

init();
animate();

function init() {
    container = document.getElementById('container');

    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x505050);

    // Camera setup
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.set(0, 1.6, 3);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    // VR Button
    document.body.appendChild(VRButton.createButton(renderer));

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1).normalize();
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Create canvas panel (320x180)
    const canvasGeometry = new THREE.PlaneGeometry(3.2, 1.8); // Scaled up for better visibility in VR
    const canvasTexture = new THREE.CanvasTexture(createCanvas());
    const canvasMaterial = new THREE.MeshBasicMaterial({ 
        map: canvasTexture,
        side: THREE.DoubleSide 
    });
    canvasPanel = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvasPanel.position.set(0, 1.6, -2); // Positioned in front of the user
    scene.add(canvasPanel);

    // Controllers setup
    const controllerModelFactory = new XRControllerModelFactory();

    // Controller 1
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    // Controller 2
    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    // Raycaster setup
    raycaster = new THREE.Raycaster();

    // Line for visualizing the raycast
    const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -1)
    ]);

    const line = new THREE.Line(geometry);
    line.name = 'line';
    line.scale.z = 5;

    controller1.add(line.clone());
    controller2.add(line.clone());

    // XR Session Change Handler
    renderer.xr.addEventListener('sessionstart', () => {
        isInVR = true;
    });

    renderer.xr.addEventListener('sessionend', () => {
        isInVR = false;
    });

    // Window resize handler
    window.addEventListener('resize', onWindowResize, false);
}

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const context = canvas.getContext('2d');
    
    // Fill with a light color
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a border
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.strokeRect(0, 0, canvas.width, canvas.height);
    
    return canvas;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onSelectStart(event) {
    if (!isInVR) return;
    
    const controller = event.target;
    const intersections = getIntersections(controller);

    if (intersections.length > 0) {
        const intersection = intersections[0];
        // Handle intersection with canvas panel
        console.log('Hit canvas at:', intersection.point);
    }
}

function onSelectEnd(event) {
    // Handle controller select end if needed
}

function getIntersections(controller) {
    if (!isInVR) return [];

    tempMatrix.identity().extractRotation(controller.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

    return raycaster.intersectObject(canvasPanel);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    if (isInVR) {
        // Update raycaster intersections
        const intersections1 = getIntersections(controller1);
        const intersections2 = getIntersections(controller2);

        // You can use these intersections to update the canvas or handle interactions
    }

    renderer.render(scene, camera);
} 