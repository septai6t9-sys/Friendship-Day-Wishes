// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('scroll-progress').style.width = scrolled + '%';
});

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const htmlElement = document.documentElement;

themeToggle.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    if (htmlElement.classList.contains('dark')) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    }
});

// Audio Vibe Toggle
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
const musicStatus = document.getElementById('music-status');
const musicPing = document.getElementById('music-ping');

let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (!isPlaying) {
        bgMusic.play().then(() => {
            isPlaying = true;
            musicStatus.textContent = 'Vibe Playing';
            musicIcon.classList.add('animate-spin');
            musicPing.classList.add('bg-emerald-400');
            musicPing.classList.remove('bg-pink-400');
        }).catch(e => {
            console.log("Audio play blocked or unavailable:", e);
            alert("Please interact with the page first or check audio source.");
        });
    } else {
        bgMusic.pause();
        isPlaying = false;
        musicStatus.textContent = 'Play Vibe';
        musicIcon.classList.remove('animate-spin');
        musicPing.classList.remove('bg-emerald-400');
        musicPing.classList.add('bg-pink-400');
    }
});

// Canvas Particle & Cursor Effects (Hearts, Sparkles, Stars)
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const symbols = ['❤️', '✨', '⭐', '💖', '💙'];

class Particle {
    constructor(x, y, symbol) {
        this.x = x;
        this.y = y;
        this.symbol = symbol;
        this.size = Math.random() * 14 + 10;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4 - 1;
        this.gravity = 0.05;
        this.opacity = 1;
        this.decay = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.opacity -= this.decay;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.font = `${this.size}px sans-serif`;
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.restore();
    }
}

// Mouse / Touch Move Effect
window.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.3) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        particles.push(new Particle(e.clientX, e.clientY, symbol));
    }
});

window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0 && Math.random() < 0.4) {
        const touch = e.touches[0];
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        particles.push(new Particle(touch.clientX, touch.clientY, symbol));
    }
}, { passive: true });

// Click Effect (Confetti + Particle burst)
window.addEventListener('click', (e) => {
    confetti({
        particleCount: 30,
        spread: 60,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#ec4899', '#6366f1', '#f43f5e', '#a855f7']
    });

    for (let i = 0; i < 8; i++) {
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        particles.push(new Particle(e.clientX, e.clientY, symbol));
    }
});

// Animation Loop for Canvas
function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// Swiper Initialization
const swiper = new Swiper('.memory-swiper', {
    loop: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    effect: 'creative',
    creativeEffect: {
        prev: { shadow: true, translate: ['-20%', 0, -1] },
        next: { translate: ['100%', 0, 0] },
    },
});

// Open Letter Modal
const envelopeContainer = document.getElementById('envelope-container');
const letterModal = document.getElementById('letter-modal');
const closeLetter = document.getElementById('close-letter');
const letterContent = document.getElementById('letter-content');

envelopeContainer.addEventListener('click', () => {
    letterModal.classList.remove('hidden');
    setTimeout(() => {
        letterModal.classList.remove('opacity-0');
        letterContent.classList.remove('scale-95');
    }, 10);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
});

closeLetter.addEventListener('click', () => {
    letterModal.classList.add('opacity-0');
    letterContent.classList.add('scale-95');
    setTimeout(() => {
        letterModal.classList.add('hidden');
    }, 300);
});

letterModal.addEventListener('click', (e) => {
    if (e.target === letterModal) {
        closeLetter.click();
    }
});

// Friendship Meter Animation on Scroll
const observerOptions = { threshold: 0.3 };
const meterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const fills = entry.target.querySelectorAll('.meter-fill');
            fills.forEach(fill => {
                const targetWidth = fill.getAttribute('data-width');
                fill.style.width = targetWidth + '%';
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

const meterSection = document.querySelector('.max-w-4xl.mx-auto');
if (meterSection) {
    meterObserver.observe(meterSection);
}

// Mini Game: Catch the Hearts
const startGameBtn = document.getElementById('start-game-btn');
const restartGameBtn = document.getElementById('restart-game-btn');
const startScreen = document.getElementById('game-start-screen');
const playScreen = document.getElementById('game-play-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const gameArea = document.getElementById('game-area');
const gameScoreEl = document.getElementById('game-score');
const gameTimerEl = document.getElementById('game-timer');
const finalScoreEl = document.getElementById('final-score');

let score = 0;
let timeLeft = 20;
let gameInterval = null;
let heartSpawnInterval = null;

startGameBtn.addEventListener('click', startGame);
restartGameBtn.addEventListener('click', startGame);

function startGame() {
    score = 0;
    timeLeft = 20;
    gameScoreEl.textContent = score;
    gameTimerEl.textContent = timeLeft;

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    playScreen.classList.remove('hidden');
    gameArea.innerHTML = '';

    gameInterval = setInterval(() => {
        timeLeft--;
        gameTimerEl.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    heartSpawnInterval = setInterval(spawnGameHeart, 600);
}

function spawnGameHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'absolute text-3xl cursor-pointer select-none transition-transform hover:scale-125';
    
    const maxX = gameArea.clientWidth - 40;
    const maxY = gameArea.clientHeight - 40;
    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));

    heart.style.left = randomX + 'px';
    heart.style.top = randomY + 'px';

    heart.addEventListener('click', () => {
        score++;
        gameScoreEl.textContent = score;
        confetti({
            particleCount: 15,
            spread: 40,
            origin: { x: (gameArea.getBoundingClientRect().left + randomX) / window.innerWidth, y: (gameArea.getBoundingClientRect().top + randomY) / window.innerHeight }
        });
        heart.remove();
    });

    gameArea.appendChild(heart);

    setTimeout(() => {
        if (heart.parentElement) {
            heart.remove();
        }
    }, 1200);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(heartSpawnInterval);
    playScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreEl.textContent = score;
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
}

// Surprise Button
const surpriseBtn = document.getElementById('surprise-btn');
surpriseBtn.addEventListener('click', () => {
    confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ec4899', '#6366f1', '#f43f5e', '#fbbf24', '#34d399']
    });

    // Temporary background transformation flash
    document.body.style.transition = 'background-color 0.5s ease';
    document.body.style.backgroundColor = '#311026';
    setTimeout(() => {
        document.body.style.backgroundColor = '';
    }, 1500);

    alert("🎉 SURPRISE! You're officially recognized as the most legendary friend in the entire galaxy! 💙 — By ISHAAN");
});
