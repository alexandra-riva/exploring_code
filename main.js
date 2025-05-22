import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';
import { ControllerCubes } from './modules/ControllerCubes.js';
import { ControllerRays } from './modules/ControllerRays.js';

let container;
let camera, scene, renderer;
let controller1, controller2;
let controllerGrip1, controllerGrip2;
let raycaster;
let canvasPanel;
let isInVR = false;

// Controller visualization instances
let controllerCubes;
let controllerRays;

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
    const canvasGeometry = new THREE.PlaneGeometry(3.2, 1.8);
    const canvasTexture = new THREE.CanvasTexture(createCanvas());
    const canvasMaterial = new THREE.MeshBasicMaterial({ 
        map: canvasTexture,
        side: THREE.DoubleSide 
    });
    canvasPanel = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvasPanel.position.set(0, 1.6, -2);
    scene.add(canvasPanel);

    // Initialize controller visualization
    controllerCubes = new ControllerCubes();
    controllerRays = new ControllerRays();

    // Controllers setup
    const controllerModelFactory = new XRControllerModelFactory();

    // Controller 1 (Left)
    controller1 = renderer.xr.getController(0);
    controller1.addEventListener('selectstart', onSelectStart);
    controller1.addEventListener('selectend', onSelectEnd);
    scene.add(controller1);

    controllerGrip1 = renderer.xr.getControllerGrip(0);
    controllerGrip1.add(controllerModelFactory.createControllerModel(controllerGrip1));
    scene.add(controllerGrip1);

    // Controller 2 (Right)
    controller2 = renderer.xr.getController(1);
    controller2.addEventListener('selectstart', onSelectStart);
    controller2.addEventListener('selectend', onSelectEnd);
    scene.add(controller2);

    controllerGrip2 = renderer.xr.getControllerGrip(1);
    controllerGrip2.add(controllerModelFactory.createControllerModel(controllerGrip2));
    scene.add(controllerGrip2);

    // Add cubes and rays when entering VR
    renderer.xr.addEventListener('sessionstart', () => {
        isInVR = true;
        // Add cubes to controllers
        const cube1 = controllerCubes.addCubeToController(controller1, 0);
        const cube2 = controllerCubes.addCubeToController(controller2, 1);
        
        // Add rays to cubes
        controllerRays.addRayToCube(cube1, 0);
        controllerRays.addRayToCube(cube2, 1);
    });

    renderer.xr.addEventListener('sessionend', () => {
        isInVR = false;
    });

    // Raycaster setup
    raycaster = new THREE.Raycaster();

    // Window resize handler
    window.addEventListener('resize', onWindowResize, false);
}

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 180;
    const context = canvas.getContext('2d');
    
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
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
    const controllerIndex = (controller === controller1) ? 0 : 1;
    
    // Highlight ray for left controller only
    if (controllerIndex === 0) {
        controllerRays.highlightRay(controllerIndex);
    }

    const intersections = getIntersections(controller);
    if (intersections.length > 0) {
        const intersection = intersections[0];
        console.log('Hit canvas at:', intersection.point);
    }
}

function onSelectEnd(event) {
    if (!isInVR) return;
    
    const controller = event.target;
    const controllerIndex = (controller === controller1) ? 0 : 1;
    
    // Unhighlight ray for left controller only
    if (controllerIndex === 0) {
        controllerRays.unhighlightRay(controllerIndex);
    }
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
    }

    renderer.render(scene, camera);
} 