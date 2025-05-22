import * as THREE from 'three';

export class ControllerRays {
    constructor() {
        this.rays = new Map(); // Store rays by controller index
        this.defaultColor = 0xffffff;
        this.highlightColor = 0xff0000;
        this.defaultLineWidth = 2;
        this.highlightLineWidth = 5;
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
        line.scale.z = 5; // Length of the ray
        return line;
    }

    addRayToController(controller, index) {
        const ray = this.createRayLine();
        controller.add(ray);
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