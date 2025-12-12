import * as THREE from 'three';
import gsap from 'gsap';

export class RoboticsHero {
    constructor(scene, camera) {
        this.scene = scene;
        this.camera = camera;
        this.armGroup = new THREE.Group();
        this.mouse = new THREE.Vector2();
        this.target = new THREE.Vector3();

        this.init();
    }

    init() {
        // Materials
        const neonMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ffaa,
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x00ffaa,
            emissiveIntensity: 0.2
        });

        const darkMetalMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            roughness: 0.5,
            metalness: 0.9
        });

        const jointMaterial = new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            roughness: 0.2,
            metalness: 0.8,
            emissive: 0x00aaff,
            emissiveIntensity: 0.5
        });

        // --- Base ---
        const baseGeo = new THREE.CylinderGeometry(1, 1.2, 0.5, 32);
        const baseMesh = new THREE.Mesh(baseGeo, darkMetalMaterial);
        baseMesh.position.y = -2;
        this.armGroup.add(baseMesh);

        // --- Lower Arm ---
        this.lowerArmGroup = new THREE.Group();
        this.lowerArmGroup.position.y = -1.75;
        this.armGroup.add(this.lowerArmGroup);

        const lowerJointGeo = new THREE.SphereGeometry(0.6, 32, 32);
        const lowerJoint = new THREE.Mesh(lowerJointGeo, jointMaterial);
        this.lowerArmGroup.add(lowerJoint);

        const lowerArmGeo = new THREE.BoxGeometry(0.5, 2.5, 0.5);
        const lowerArm = new THREE.Mesh(lowerArmGeo, darkMetalMaterial);
        lowerArm.position.y = 1.25;
        this.lowerArmGroup.add(lowerArm);

        // Neon strips on lower arm
        const stripGeo = new THREE.BoxGeometry(0.52, 2.0, 0.1);
        const strip = new THREE.Mesh(stripGeo, neonMaterial);
        strip.position.y = 1.25;
        this.lowerArmGroup.add(strip);


        // --- Upper Arm ---
        this.upperArmGroup = new THREE.Group();
        this.upperArmGroup.position.y = 2.5; // Top of lower arm
        this.lowerArmGroup.add(this.upperArmGroup);

        const upperJointGeo = new THREE.SphereGeometry(0.5, 32, 32);
        const upperJoint = new THREE.Mesh(upperJointGeo, jointMaterial);
        this.upperArmGroup.add(upperJoint);

        const upperArmGeo = new THREE.CylinderGeometry(0.2, 0.3, 2, 16);
        const upperArm = new THREE.Mesh(upperArmGeo, darkMetalMaterial);
        upperArm.rotation.x = Math.PI / 2; // Point forward initially
        upperArm.position.z = 1;
        this.upperArmGroup.add(upperArm);

        // --- Claw / Head ---
        this.headGroup = new THREE.Group();
        this.headGroup.position.z = 2;
        this.upperArmGroup.add(this.headGroup);

        const headCoreGeo = new THREE.IcosahedronGeometry(0.3, 0);
        const headCore = new THREE.Mesh(headCoreGeo, neonMaterial);
        this.headGroup.add(headCore);

        // Rotating Ring around head
        const ringGeo = new THREE.TorusGeometry(0.6, 0.05, 16, 100);
        this.headRing = new THREE.Mesh(ringGeo, jointMaterial);
        this.headGroup.add(this.headRing);

        // Add to scene
        this.scene.add(this.armGroup);

        // Initial Pose
        this.armGroup.position.set(2, -1, 0);
        this.armGroup.rotation.y = -Math.PI / 4;

        // Grid Floor
        const gridHelper = new THREE.GridHelper(20, 20, 0x00ffaa, 0x050505);
        gridHelper.position.y = -2.5;
        gridHelper.material.opacity = 0.2;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onMouseMove(event) {
        // Normalize mouse coordinates
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    update(time) {
        // Smoothly look at mouse target
        // Map mouse range to 3D space
        const targetX = this.mouse.x * 5;
        const targetY = this.mouse.y * 3;

        // Basic joint articulation (Simple LookAt Logic)
        // Base rotates Y
        gsap.to(this.armGroup.rotation, {
            y: -Math.PI / 4 + this.mouse.x * 0.5,
            duration: 1
        });

        // Lower arm rotates Z/X
        gsap.to(this.lowerArmGroup.rotation, {
            z: this.mouse.x * 0.2, // Lean side to side
            x: -this.mouse.y * 0.3, // Lean forward/back
            duration: 1
        });

        // Upper arm tracks height
        gsap.to(this.upperArmGroup.rotation, {
            x: Math.PI / 2 + this.mouse.y * 0.5,
            duration: 0.8
        });

        // Head ring spin
        this.headRing.rotation.z += 0.02;
        this.headRing.rotation.y += 0.01;
    }
}
