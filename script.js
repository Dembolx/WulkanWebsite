class VolcanoSimulation {
  constructor() {
    this.meteorsContainer = document.querySelector(".meteors-container");
    this.particlesContainer = document.querySelector(".particles-container");
    this.meteors = [];
    this.particles = [];
    this.settings = {
      intensity: 1,
      meteorRate: 200,
      particleSize: 1,
      gravity: 0.3,
      autoClean: true,
      paused: false,
    };

    this.stats = {
      meteorCount: 0,
      particleCount: 0,
      fps: 60,
      frameCount: 0,
      lastTime: 0,
      lastMeteorTime: 0,
    };

    this.meteorColors = [
      { color1: "#ff0033", color2: "#ff0066" },
      { color1: "#ff3300", color2: "#ff6600" },
      { color1: "#ff0066", color2: "#ff0099" },
    ];

    this.initControls();
    this.startAnimation();
    this.startLavaParticles();
  }

  initControls() {
    document.getElementById("intensity").addEventListener("input", (e) => {
      this.settings.intensity = parseFloat(e.target.value);
    });

    document.getElementById("meteor-rate").addEventListener("input", (e) => {
      this.settings.meteorRate = parseInt(e.target.value);
    });

    document.getElementById("particle-size").addEventListener("input", (e) => {
      this.settings.particleSize = parseFloat(e.target.value);
    });

    document.getElementById("gravity").addEventListener("input", (e) => {
      this.settings.gravity = parseFloat(e.target.value);
    });

    document.getElementById("auto-clean").addEventListener("click", (e) => {
      this.settings.autoClean = !this.settings.autoClean;
      e.target.classList.toggle("active");
    });

    document.getElementById("pause-btn").addEventListener("click", (e) => {
      this.settings.paused = !this.settings.paused;
      e.target.textContent = this.settings.paused ? "Wznów" : "Pauza";
      e.target.classList.toggle("active");
    });

    document.getElementById("reset-btn").addEventListener("click", () => {
      this.reset();
    });
  }

  createMeteor() {
    const meteor = {
      element: document.createElement("div"),
      x: window.innerWidth / 2 - 3 + (Math.random() * 60 - 30),
      y: window.innerHeight - 280,
      size: Math.random() * 8 * this.settings.particleSize + 8,
      speedX: (Math.random() - 0.5) * 5 * this.settings.intensity,
      speedY: -(Math.random() * 10 + 15) * this.settings.intensity,
      life: 100,
      maxHeight: Math.random() * 200 + 100,
      isFalling: false,
      id: Date.now() + Math.random(),
    };

    meteor.element.className = "meteor";
    const color =
      this.meteorColors[Math.floor(Math.random() * this.meteorColors.length)];

    meteor.element.style.setProperty("--size", `${meteor.size}px`);
    meteor.element.style.setProperty("--color1", color.color1);
    meteor.element.style.setProperty("--color2", color.color2);
    meteor.element.style.setProperty("--opacity", "1");

    this.meteorsContainer.appendChild(meteor.element);
    this.meteors.push(meteor);
  }

  updateMeteor(meteor) {
    if (!meteor.isFalling && meteor.y < window.innerHeight - meteor.maxHeight) {
      meteor.isFalling = true;
    }

    if (meteor.isFalling) {
      meteor.speedY += this.settings.gravity;
    } else {
      meteor.speedY *= 0.98;
    }

    meteor.x += meteor.speedX;
    meteor.y += meteor.speedY;
    meteor.life--;

    meteor.element.style.left = `${meteor.x}px`;
    meteor.element.style.top = `${meteor.y}px`;
    meteor.element.style.setProperty("--opacity", meteor.life / 100);

    if (meteor.isFalling && Math.random() > 0.7) {
      this.createParticles(meteor.x, meteor.y, 3);
    }

    return meteor.life > 0 && meteor.y < window.innerHeight;
  }

  createParticles(x, y, count) {
    for (let i = 0; i < count; i++) {
      const particle = {
        element: document.createElement("div"),
        x: x,
        y: y,
        size: Math.random() * 4 * this.settings.particleSize + 2,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 3 + 1,
        life: 30 + Math.random() * 20,
        id: Date.now() + Math.random(),
      };

      particle.element.className = "particle";
      const color = `hsl(${Math.random() * 20 + 340}, 100%, 50%)`;

      particle.element.style.setProperty("--size", `${particle.size}px`);
      particle.element.style.setProperty("--color", color);
      particle.element.style.setProperty("--opacity", "0.8");

      this.particlesContainer.appendChild(particle.element);
      this.particles.push(particle);
    }
  }

  updateParticle(particle) {
    particle.x += Math.cos(particle.angle) * particle.speed;
    particle.y += Math.sin(particle.angle) * particle.speed + 1;
    particle.life--;

    const opacity = (particle.life / 50) * 0.8;

    particle.element.style.left = `${particle.x}px`;
    particle.element.style.top = `${particle.y}px`;
    particle.element.style.setProperty("--opacity", opacity);

    return particle.life > 0 && particle.y < window.innerHeight;
  }

  cleanupObjects() {
    // Cleanup meteors
    this.meteors = this.meteors.filter((meteor) => {
      if (!this.updateMeteor(meteor)) {
        meteor.element.remove();
        return false;
      }
      return true;
    });

    // Cleanup particles
    this.particles = this.particles.filter((particle) => {
      if (!this.updateParticle(particle)) {
        particle.element.remove();
        return false;
      }
      return true;
    });

    // Auto cleanup if too many objects
    if (this.settings.autoClean) {
      if (this.meteors.length > 50) {
        const toRemove = this.meteors.splice(0, 10);
        toRemove.forEach((meteor) => meteor.element.remove());
      }
      if (this.particles.length > 200) {
        const toRemove = this.particles.splice(0, 50);
        toRemove.forEach((particle) => particle.element.remove());
      }
    }
  }

  updateStats() {
    this.stats.meteorCount = this.meteors.length;
    this.stats.particleCount = this.particles.length;

    document.getElementById("meteor-count").textContent =
      this.stats.meteorCount;
    document.getElementById("particle-count").textContent =
      this.stats.particleCount;

    const temp = 2800 + Math.floor(Math.random() * 100);
    document.getElementById("temperature").textContent = `${temp}°C`;

    const activity =
      this.stats.meteorCount > 30
        ? "KRYTYCZNA"
        : this.stats.meteorCount > 15
        ? "WYSOKA"
        : "ŚREDNIA";
    document.getElementById("activity").textContent = activity;
  }

  updateFPS(currentTime){
    rhis.stats.frameCount++;
    if (currentTime - this.stats.lastTime >= 1000){
      this.startLavaParticles.fps = Math.round(
        (this.stats.frameCount * 1000) / (currentTime - this.settings.lastTime)
      );
      this.startLavaParticles.frameCount = 0;
      this.stste.lastTime = currentTime;

      document.getElementById("fps").textContent = this.stats.fps;

      const perfPercent = Math.min((this.stats.fps / 60) * 100, 100);
      document.getElementById("perf-bar").style.width = `${perfPercent}`;
    }
  }

  animate(currentTime) {
    if (!this.settings.paused) {
      // Create meteors
      if (
        !this.stats.lastMeteorTime ||
        currentTime - this.stats.lastMeteorTime > this.settings.meteorRate
      ) {
        this.createMeteor();
        this.stats.lastMeteorTime = currentTime;
      }

      this.cleanupObjects();
      this.updateStats();
    }

    this.updateFPS(currentTime);
    requestAnimationFrame((time) => this.animate(time));
  }

  startLavaParticles() {
    setInterval(() => {
      if (!this.settings.paused) {
        for (let i = 0; i < 2; i++) {
          this.createParticles(
            window.innerWidth / 2 - 40 + Math.random() * 80,
            window.innerHeight - 280 + Math.random() * 20,
            1
          );
        }
      }
    }, 100);
  }

  reset() {
    this.meteors.forEach((meteor) => meteor.element.remove());
    this.particles.forEach((particle) => particle.element.remove());
    this.meteors = [];
    this.particles = [];
    this.stats.frameCount = 0;
    this.stats.lastTime = 0;
  }

  startAnimation() {
    requestAnimationFrame((time) => this.animate(time));
  }
}

// Initialize simulation when page loads
document.addEventListener("DOMContentLoaded", () => {
  new VolcanoSimulation();
});
