import * as THREE from 'three';

export class ControllerRays {
    constructor() {
        this.rays = new Map(); // Store rays by controller index
        this.defaultColor = 0xffffff;
        this.highlightColor = 0xff0000;
        this.defaultLineWidth = 3;
        this.highlightLineWidth = 6;
    }

    createRayLine() {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -1)
        ]);

        const material = new THREE.LineBasicMaterial({
            color: this.defaultColor,
            linewidth: this.defaultLineWidth
        });

        const line = new THREE.Line(geometry, material);
        line.scale.z = 10; // Make the ray longer for better visibility
        return line;
    }

    addRayToCube(cube, index) {
        const ray = this.createRayLine();
        cube.add(ray); // Add ray as child of cube
        this.rays.set(index, ray);
        return ray;
    }

    highlightRay(index) {
        const ray = this.rays.get(index);
        if (ray) {
            ray.material.color.setHex(this.highlightColor);
            ray.material.linewidth = this.highlightLineWidth;
        }
    }

    unhighlightRay(index) {
        const ray = this.rays.get(index);
        if (ray) {
            ray.material.color.setHex(this.defaultColor);
            ray.material.linewidth = this.defaultLineWidth;
        }
    }

    getRay(index) {
        return this.rays.get(index);
    }
} 