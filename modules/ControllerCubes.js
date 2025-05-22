import * as THREE from 'three';

export class ControllerCubes {
    constructor() {
        this.cubes = new Map(); // Store cubes by controller index
    }

    createCube() {
        const geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08);
        const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material);
    }

    addCubeToController(controller, index) {
        const cube = this.createCube();
        controller.add(cube); // Add cube as child of controller
        this.cubes.set(index, cube);
        return cube;
    }

    getCube(index) {
        return this.cubes.get(index);
    }
} 