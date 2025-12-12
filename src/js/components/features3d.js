import * as THREE from 'three';
import gsap from 'gsap';

export class Features3D {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.icons = []; // Array of { mesh, domElement }

        this.init();
    }

    init() {
        const featureItems = document.querySelectorAll('.feature-item');

        const material = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            roughness: 0.1,
            metalness: 0.8,
            emissive: 0x002244,
            wireframe: false
        });

        const wireMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffaa,
            wireframe: true
        });

        const geometries = {
            'cube': new THREE.BoxGeometry(1, 1, 1),
            'torus': new THREE.TorusGeometry(0.6, 0.2, 16, 32),
            'cone': new THREE.ConeGeometry(0.7, 1.5, 32),
            'sphere': new THREE.IcosahedronGeometry(0.7, 1)
        };

        featureItems.forEach((item, index) => {
            const type = item.getAttribute('data-icon');
            const placeholder = item.querySelector('.icon-placeholder');

            if (geometries[type]) {
                const group = new THREE.Group();

                const mesh = new THREE.Mesh(geometries[type], material);
                const wire = new THREE.Mesh(geometries[type], wireMaterial);
                wire.scale.set(1.1, 1.1, 1.1);

                group.add(mesh);
                group.add(wire);

                this.scene.add(group);

                this.icons.push({
                    mesh: group,
                    domElement: placeholder,
                    baseY: 0
                });

                // Hover effect
                item.addEventListener('mouseenter', () => {
                    gsap.to(group.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: 'back.out' });
                    gsap.to(mesh.material, { emissiveIntensity: 1, duration: 0.5 });
                });
                item.addEventListener('mouseleave', () => {
                    gsap.to(group.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
                    gsap.to(mesh.material, { emissiveIntensity: 0.2, duration: 0.5 });
                });
            }
        });
    }

    update() {
        // Sync position with DOM
        // This is expensive to do every frame if there are many items, but fine for 4.
        // For better performance, update only on scroll/resize.

        this.icons.forEach(obj => {
            const rect = obj.domElement.getBoundingClientRect();

            // Map 2D screen coordinates to 3D world coordinates
            // This is an approximation. For exact match, we need raycasting or unproject.

            const x = (rect.left + rect.width / 2) / window.innerWidth * 2 - 1;
            const y = -(rect.top + rect.height / 2) / window.innerHeight * 2 + 1;

            const vector = new THREE.Vector3(x, y, 0.5);
            vector.unproject(this.camera);

            const dir = vector.sub(this.camera.position).normalize();
            const distance = (0 - this.camera.position.z) / dir.z; // Project to z=0 plane or similar
            const pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

            // We want them slightly in front or at z=0 if camera is at z=8
            // Let's manually tweak 

            // Simpler: Just map to visible bounds at a fixed Z depth (e.g. 0)
            // Visible height at z=0
            const dist = this.camera.position.z - 0;
            const vFov = this.camera.fov * Math.PI / 180;
            const height = 2 * Math.tan(vFov / 2) * dist;
            const width = height * this.camera.aspect;

            obj.mesh.position.x = x * width / 2;
            obj.mesh.position.y = y * height / 2;

            // Rotation
            obj.mesh.rotation.y += 0.01;
            obj.mesh.rotation.x += 0.005;
        });
    }
}
