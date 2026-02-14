export default function StarBackground() {
  return `<canvas id="star-canvas" class="fixed top-0 left-0 w-full h-full pointer-events-none -z-10"></canvas>`;
}

export function initStars() {
  const canvas = document.getElementById("star-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let stars = [];

  // --- CONFIGURATION ---
  const STAR_COUNT = 450; // Increased density (was 150)
  const ROTATION_SPEED = 0.0005; // The speed of the galaxy spin

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    createStars();
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      // We spawn stars at random distances from the center
      const x = Math.random() * width - width / 2;
      const y = Math.random() * height - height / 2;
      const distance = Math.sqrt(x * x + y * y);

      stars.push({
        x: x,
        y: y,
        angle: Math.atan2(y, x), // Calculate initial angle
        radius: distance, // Distance from center
        size: Math.random() * 1.5,
        alpha: Math.random(),
        twinkleSpeed: Math.random() * 0.02,
      });
    }
  }

  function animate() {
    // 1. Fade effect (Instead of clearRect, we fill with transparent black)
    // This creates slight "trails" which looks faster
    ctx.fillStyle = "rgba(5, 5, 5, 0.3)";
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    stars.forEach((star) => {
      // 2. Rotate the star
      star.angle += ROTATION_SPEED;

      // 3. Calculate new X/Y based on angle
      const newX = centerX + Math.cos(star.angle) * star.radius;
      const newY = centerY + Math.sin(star.angle) * star.radius;

      // 4. Twinkle Logic
      if (Math.random() > 0.99) {
        star.alpha = Math.random();
      }

      // 5. Draw
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.beginPath();
      ctx.arc(newX, newY, star.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();
}
