/**
 * Multi-Mode 3D Cybersecurity Scene Engine
 * Features 3 Switchable Animations with Mobile Touch Support:
 * 1. Cybersecurity Core (Geometric Wireframe Shield)
 * 2. Cyber Matrix Tunnel (Infinite Wireframe Tunnel)
 * 3. Quantum Encryption Cube (3D Wireframe Hypercube Matrix)
 */

(function () {
    let scene, camera, renderer;
    let pointLight1, pointLight2, ambientLight;
    let clock = new THREE.Clock();

    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Active mode tracking: 'core', 'tunnel', or 'cube'
    let currentMode = 'core';
    let activeObjects = [];

    // Theme Color Palette Configuration
    const colorPalettes = {
        dark: {
            primary: 0xFF2E93,      // Crimson
            secondary: 0xFF9900,    // Amber
            particles: 0xFF2E93,
            ambient: 0x1A1C23,
            shieldOpacity: 0.65
        },
        light: {
            primary: 0x4A00E0,      // Electric Indigo
            secondary: 0xD6006E,    // Deep Crimson-Magenta
            particles: 0x2E008B,    // Dark Violet
            ambient: 0xCCCCCC,
            shieldOpacity: 0.85
        }
    };

    init3D();
    createUIControls();
    animate();

    function init3D() {
        const canvas = document.getElementById('three-canvas');

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5.2;

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Cap pixel ratio to max 1.5 to optimize GPU and battery life on high-DPI mobile screens
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

        // Lighting Setup
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const colors = colorPalettes[currentTheme];

        ambientLight = new THREE.AmbientLight(colors.ambient, 2.5);
        scene.add(ambientLight);

        pointLight1 = new THREE.PointLight(colors.primary, 4, 60);
        pointLight1.position.set(6, 6, 6);
        scene.add(pointLight1);

        pointLight2 = new THREE.PointLight(colors.secondary, 4, 60);
        pointLight2.position.set(-6, -6, -6);
        scene.add(pointLight2);

        // Build Default Scene
        buildCurrentScene();

        // Mouse and Touch Event Listeners
        window.addEventListener('resize', onWindowResize);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('themeChanged', () => updateSceneTheme());
    }

    /**
     * Clears previous 3D objects from scene
     */
    function clearActiveObjects() {
        activeObjects.forEach(obj => scene.remove(obj));
        activeObjects = [];
    }

    /**
     * Rebuilds scene based on selected mode
     */
    function buildCurrentScene() {
        clearActiveObjects();
        const theme = document.documentElement.getAttribute('data-theme') || 'dark';
        const colors = colorPalettes[theme];

        if (currentMode === 'core') {
            buildSecurityCore(colors, theme);
        } else if (currentMode === 'tunnel') {
            buildMatrixTunnel(colors, theme);
        } else if (currentMode === 'cube') {
            buildQuantumCube(colors, theme);
        }
    }

    /* --------------------------------------------------------------------------
       ANIMATION MODE 1: CYBERSECURITY CORE
       -------------------------------------------------------------------------- */
    function buildSecurityCore(colors, theme) {
        camera.position.set(0, 0, 5.2);

        const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
        const coreMat = new THREE.MeshPhongMaterial({
            color: colors.primary,
            wireframe: true,
            emissive: colors.primary,
            emissiveIntensity: theme === 'light' ? 0.8 : 0.6
        });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.name = 'coreMesh';
        scene.add(coreMesh);
        activeObjects.push(coreMesh);

        const shieldGeo = new THREE.OctahedronGeometry(3.2, 2);
        const shieldMat = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            wireframe: true,
            transparent: true,
            opacity: colors.shieldOpacity
        });
        const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        shieldMesh.name = 'shieldMesh';
        scene.add(shieldMesh);
        activeObjects.push(shieldMesh);

        const ringGeo = new THREE.TorusGeometry(3.8, 0.025, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: colors.secondary, transparent: true, opacity: 0.6 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 3;
        ringMesh.name = 'ringMesh';
        scene.add(ringMesh);
        activeObjects.push(ringMesh);

        addBackgroundParticles(colors, 700);
    }

    /* --------------------------------------------------------------------------
       ANIMATION MODE 2: CYBER MATRIX TUNNEL
       -------------------------------------------------------------------------- */
    function buildMatrixTunnel(colors, theme) {
        camera.position.set(0, 0, 0);

        const tunnelGroup = new THREE.Group();
        tunnelGroup.name = 'tunnelGroup';

        const ringCount = 25;
        for (let i = 0; i < ringCount; i++) {
            const geom = new THREE.CylinderGeometry(3.5, 3.5, 0.1, 8, 1, true);
            const mat = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? colors.primary : colors.secondary,
                wireframe: true,
                transparent: true,
                opacity: theme === 'light' ? 0.7 : 0.5
            });
            const ring = new THREE.Mesh(geom, mat);
            ring.position.z = -i * 1.8;
            ring.rotation.x = Math.PI / 2;
            tunnelGroup.add(ring);
        }

        scene.add(tunnelGroup);
        activeObjects.push(tunnelGroup);

        addBackgroundParticles(colors, 500);
    }

    /* --------------------------------------------------------------------------
       ANIMATION MODE 3: QUANTUM ENCRYPTION CUBE MATRIX
       -------------------------------------------------------------------------- */
    function buildQuantumCube(colors, theme) {
        camera.position.set(0, 0, 5.5);

        const cubeGroup = new THREE.Group();
        cubeGroup.name = 'cubeGroup';

        const outerGeo = new THREE.BoxGeometry(3.2, 3.2, 3.2);
        const outerMat = new THREE.MeshPhongMaterial({
            color: colors.primary,
            wireframe: true,
            emissive: colors.primary,
            emissiveIntensity: theme === 'light' ? 0.8 : 0.6
        });
        const outerCube = new THREE.Mesh(outerGeo, outerMat);
        cubeGroup.add(outerCube);

        const innerGeo = new THREE.BoxGeometry(2.0, 2.0, 2.0);
        const innerMat = new THREE.MeshStandardMaterial({
            color: colors.secondary,
            wireframe: true,
            transparent: true,
            opacity: theme === 'light' ? 0.85 : 0.7
        });
        const innerCube = new THREE.Mesh(innerGeo, innerMat);
        innerCube.name = 'innerCube';
        cubeGroup.add(innerCube);

        const coreNodeGeo = new THREE.OctahedronGeometry(0.9, 1);
        const coreNodeMat = new THREE.MeshBasicMaterial({
            color: colors.primary,
            wireframe: true
        });
        const coreNode = new THREE.Mesh(coreNodeGeo, coreNodeMat);
        coreNode.name = 'coreNode';
        cubeGroup.add(coreNode);

        scene.add(cubeGroup);
        activeObjects.push(cubeGroup);

        addBackgroundParticles(colors, 600);
    }

    function addBackgroundParticles(colors, count) {
        const pGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 22;
            positions[i + 1] = (Math.random() - 0.5) * 22;
            positions[i + 2] = (Math.random() - 0.5) * 22;
        }

        pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({
            color: colors.particles,
            size: 0.05,
            transparent: true,
            opacity: 0.75
        });
        const pMesh = new THREE.Points(pGeo, pMat);
        pMesh.name = 'bgParticles';
        scene.add(pMesh);
        activeObjects.push(pMesh);
    }

    /**
     * UI Mode Switcher Widget
     */
    function createUIControls() {
        const existing = document.querySelector('.scene-switcher-widget');
        if (existing) existing.remove();

        const switcher = document.createElement('div');
        switcher.className = 'scene-switcher-widget';
        switcher.innerHTML = `
            <span class="switcher-label"><i class="fa-solid fa-cubes"></i> 3D MODE</span>
            <button data-mode="core" class="switcher-btn ${currentMode === 'core' ? 'active' : ''}">Core</button>
            <button data-mode="tunnel" class="switcher-btn ${currentMode === 'tunnel' ? 'active' : ''}">Tunnel</button>
            <button data-mode="cube" class="switcher-btn ${currentMode === 'cube' ? 'active' : ''}">Cube Matrix</button>
        `;

        document.body.appendChild(switcher);

        switcher.querySelectorAll('.switcher-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                switcher.querySelectorAll('.switcher-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                currentMode = e.target.getAttribute('data-mode');
                buildCurrentScene();
            });
        });
    }

    function onMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 80;
        mouseY = (event.clientY - windowHalfY) / 80;
    }

    function onTouchMove(event) {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - windowHalfX) / 80;
            mouseY = (event.touches[0].clientY - windowHalfY) / 80;
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function updateSceneTheme() {
        buildCurrentScene();
    }

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Mode Specific Animations
        if (currentMode === 'core') {
            const core = scene.getObjectByName('coreMesh');
            const shield = scene.getObjectByName('shieldMesh');
            const ring = scene.getObjectByName('ringMesh');

            if (core) {
                core.rotation.x = elapsedTime * 0.2;
                core.rotation.y = elapsedTime * 0.35;
                core.position.y = Math.sin(elapsedTime * 1.2) * 0.25;
            }
            if (shield) {
                shield.rotation.x = -elapsedTime * 0.15;
                shield.rotation.y = -elapsedTime * 0.25;
                shield.position.y = Math.sin(elapsedTime * 1.2) * 0.25;
            }
            if (ring) {
                ring.rotation.z = elapsedTime * 0.1;
            }
        } else if (currentMode === 'tunnel') {
            const tunnel = scene.getObjectByName('tunnelGroup');
            if (tunnel) {
                tunnel.children.forEach((ring) => {
                    ring.position.z += 0.04;
                    ring.rotation.z += 0.005;
                    if (ring.position.z > 2) {
                        ring.position.z = -25 * 1.8;
                    }
                });
            }
        } else if (currentMode === 'cube') {
            const cubeGroup = scene.getObjectByName('cubeGroup');
            if (cubeGroup) {
                cubeGroup.rotation.x = elapsedTime * 0.2;
                cubeGroup.rotation.y = elapsedTime * 0.3;
                cubeGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.2;

                const innerCube = cubeGroup.getObjectByName('innerCube');
                if (innerCube) {
                    innerCube.rotation.x = -elapsedTime * 0.4;
                    innerCube.rotation.y = -elapsedTime * 0.5;
                }

                const coreNode = cubeGroup.getObjectByName('coreNode');
                if (coreNode) {
                    coreNode.rotation.y = elapsedTime * 0.6;
                }
            }
        }

        const bgParticles = scene.getObjectByName('bgParticles');
        if (bgParticles) {
            bgParticles.rotation.y = elapsedTime * 0.02;
        }

        // Parallax Camera Interpolation
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX;
        camera.position.y = -targetY;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
})();