const canvas = document.querySelector('#webgl-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Configuration for "Professional Tech Touch"
const config = {
    count: 80,             // Not too crowded
    color: '0, 243, 255',  // Cyan base
    baseOpacity: 0.4,      // Increased visibility
    rangeOpacity: 0.3,     // Variation
    speed: 0.2,            // Very slow drift
    sizeBase: 1,           // Tiny dots/squares
    sizeRange: 1.5,
    connectionDist: 100,
    mouseDist: 150
};

const mouse = { x: null, y: null };

class Particle {
    constructor() {
        this.reset(true);
    }

    reset(randomY = false) {
        this.x = Math.random() * width;
        this.y = randomY ? Math.random() * height : height + 10;
        this.vx = (Math.random() - 0.5) * config.speed;
        this.vy = -(Math.random() * config.speed + 0.1); // Always drift up slowly
        this.size = Math.random() * config.sizeRange + config.sizeBase;
        this.opacity = Math.random() * config.rangeOpacity + config.baseOpacity;
        this.fade = Math.random() * 0.002 + 0.001; // Blink speed
        this.fadeDir = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Twinkle effect
        this.opacity += this.fade * this.fadeDir;
        if (this.opacity > config.baseOpacity + config.rangeOpacity || this.opacity < config.baseOpacity) {
            this.fadeDir *= -1;
        }

        // Mouse interaction (Repel slightly)
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.mouseDist) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (config.mouseDist - distance) / config.mouseDist;

                // Gentle push
                this.x -= forceDirectionX * force * 1;
                this.y -= forceDirectionY * force * 1;
            }
        }

        // Reset if out of bounds (top)
        if (this.y < -10) {
            this.reset(false);
        }
        // Wrap X
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
    }

    draw() {
        ctx.fillStyle = `rgba(${config.color}, ${this.opacity})`;
        ctx.beginPath();
        // Drawing squares for a "tech" feel instead of circles
        ctx.rect(this.x, this.y, this.size, this.size);
        ctx.fill();
    }
}

function init() {
    resize();
    createParticles();
    animate();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createParticles(); // Re-create to fill space
}

function createParticles() {
    particles = [];
    let count = (width * height) / 15000;
    if (count > 100) count = 100; // Cap it

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // No background fill here, CSS handles the dark gradient.

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    // Optional: Subtle Connections (Constellation)
    // Only connect if very close, to keep it minimal
    connectParticles();

    requestAnimationFrame(animate);
}

function connectParticles() {
    // Only connect a few, avoid web mess
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let dx = particles[a].x - particles[b].x;
            let dy = particles[a].y - particles[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < config.connectionDist) {
                let opacityValue = (1 - (distance / config.connectionDist)) * 0.15; // Very low opacity lines
                ctx.strokeStyle = `rgba(${config.color}, ${opacityValue})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

export function initScene() {
    init();
}
