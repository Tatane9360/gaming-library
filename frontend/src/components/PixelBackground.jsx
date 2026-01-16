import React, { useEffect, useRef } from 'react';

class Particle {
    constructor(canvas, colors, x, y, isBurst = false) {
        this.canvas = canvas;
        this.colors = colors;
        this.isBurst = isBurst;
        this.reset(x, y);
    }

    reset(x, y) {
        this.x = x !== undefined ? x : Math.random() * this.canvas.width;
        this.y = y !== undefined ? y : Math.random() * this.canvas.height;
        this.size = Math.random() * 5 + 3;

        if (this.isBurst) {
            const angle = Math.random() * Math.PI * 2;
            const force = Math.random() * 4 + 2;
            this.speedX = Math.cos(angle) * force;
            this.speedY = Math.sin(angle) * force;
            this.life = 1.0;
            this.decay = Math.random() * 0.02 + 0.01;
        } else {
            this.speedX = 0;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.life = 1.0;
            this.decay = 0;
        }

        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.opacity = Math.random() * 0.6 + 0.2;
        this.pulse = Math.random() * 0.02;
        this.pulseDir = 1;
    }

    update() {
        if (this.isBurst) {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
        } else {
            this.y += this.speedY;
            if (this.y > this.canvas.height) {
                this.y = -this.size;
                this.x = Math.random() * this.canvas.width;
            }
            this.opacity += this.pulse * this.pulseDir;
            if (this.opacity > 0.8 || this.opacity < 0.2) {
                this.pulseDir *= -1;
            }
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.isBurst ? this.life * this.opacity : this.opacity;

        // Pixel block look
        ctx.fillRect(this.x, this.y, this.size, this.size);

        // Stronger glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
    }
}

const PixelBackground = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const burstParticlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const colors = ['#ff00ff', '#00ffff', '#ffff00', '#4f46e5'];

        const createBurst = (e) => {
            for (let i = 0; i < 15; i++) {
                burstParticlesRef.current.push(new Particle(canvas, colors, e.clientX, e.clientY, true));
            }
        };

        window.addEventListener('resize', resize);
        window.addEventListener('click', createBurst);
        resize();

        // More particles for "more apparent" look
        const particleCount = 120;
        particlesRef.current = [];
        for (let i = 0; i < particleCount; i++) {
            particlesRef.current.push(new Particle(canvas, colors));
        }

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background particles
            particlesRef.current.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            // Burst particles
            burstParticlesRef.current = burstParticlesRef.current.filter(p => p.life > 0);
            burstParticlesRef.current.forEach(p => {
                p.update();
                p.draw(ctx);
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('click', createBurst);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-deep"
            style={{ opacity: 0.6 }}
        />
    );
};

export default PixelBackground;
