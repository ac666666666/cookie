const Confetti = {
    // Basic configuration
    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
    speed: 10,
    count: 150,

    launch: function() {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '99999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // Handle resize
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };
        window.addEventListener('resize', resize);
        resize();

        // Particles
        const particles = [];
        for (let i = 0; i < this.count; i++) {
            particles.push(new Particle(width, height, this.colors));
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            let activeCount = 0;
            particles.forEach(p => {
                if (p.update(height)) {
                    p.draw(ctx);
                    activeCount++;
                }
            });

            if (activeCount > 0) {
                animationId = requestAnimationFrame(animate);
            } else {
                // Cleanup
                cancelAnimationFrame(animationId);
                window.removeEventListener('resize', resize);
                document.body.removeChild(canvas);
            }
        };

        animate();
    }
};

class Particle {
    constructor(canvasWidth, canvasHeight, colors) {
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        
        // Random spread
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 15 + 5;
        
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        
        this.gravity = 0.5;
        this.friction = 0.95;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 6 + 4;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
    }

    update(canvasHeight) {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.decay;
        this.rotation += this.rotationSpeed;

        return this.alpha > 0 && this.y < canvasHeight + 50;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}
