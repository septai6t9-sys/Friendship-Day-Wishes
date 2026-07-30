
/* ==========================================
   1. AUDIO SYNTHESIZER (Web Audio API)
   ========================================== */
class SoundFX {
    constructor() {
        this.ctx = null;
        this.muted = false;
    }
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    playTone(freq, type, duration) {
        if (this.muted) return;
        this.init();
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type || 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }
    click() { this.playTone(600, 'sine', 0.1); }
    success() { 
        this.playTone(523.25, 'triangle', 0.1); 
        setTimeout(() => this.playTone(659.25, 'triangle', 0.15), 100);
        setTimeout(() => this.playTone(783.99, 'triangle', 0.25), 200);
    }
    pop() { this.playTone(300, 'sine', 0.08); }
}
const SFX = new SoundFX();
document.getElementById('btn-sound-toggle').addEventListener('click', function() {
    SFX.muted = !SFX.muted;
    this.innerHTML = SFX.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
});
// Universal Click Effect & Sound
window.addEventListener('click', (e) => {
    SFX.click();
    createClickParticle(e.clientX, e.clientY);
});
function createClickParticle(x, y) {
    const el = document.createElement('div');
    el.innerHTML = '❤️';
    el.style.position = 'fixed';
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.pointerEvents = 'none';
    el.style.zIndex = '99999';
    el.style.transform = 'translate(-50%, -50%) scale(1)';
    el.style.transition = 'all 0.6s ease-out';
    document.body.appendChild(el);
    setTimeout(() => {
        el.style.transform = 'translate(-50%, -80px) scale(1.5)';
        el.style.opacity = '0';
    }, 20);
    setTimeout(() => el.remove(), 600);
}
/* ==========================================
   2. CANVAS BACKGROUND & CURSOR TRAILS
   ========================================== */
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
const curCanvas = document.getElementById('cursor-canvas');
const curCtx = curCanvas.getContext('2d');
let width, height;
let particles = [];
let trail = [];
function resizeCanvas() {
    width = bgCanvas.width = curCanvas.width = window.innerWidth;
    height = bgCanvas.height = curCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
// Background Star/Firefly Particles
for (let i = 0; i < 60; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random()
    });
}
window.addEventListener('mousemove', (e) => {
    trail.push({ x: e.clientX, y: e.clientY, alpha: 1, size: Math.random() * 10 + 5 });
});
function renderCanvas() {
    // Background Animation
    bgCtx.clearRect(0, 0, width, height);
    
    // Soft Radial Glow Overlay
    const grad = bgCtx.createRadialGradient(width/2, height/2, 100, width/2, height/2, Math.max(width, height));
    grad.addColorStop(0, '#0d122b');
    grad.addColorStop(1, '#05070e');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, width, height);
    bgCtx.fillStyle = '#00f2fe';
    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        bgCtx.globalAlpha = p.alpha;
        bgCtx.beginPath();
        bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        bgCtx.fill();
    });
    // Cursor Trail Rendering
    curCtx.clearRect(0, 0, width, height);
    for (let i = 0; i < trail.length; i++) {
        const t = trail[i];
        curCtx.globalAlpha = t.alpha;
        curCtx.fillStyle = '#ff2a85';
        curCtx.beginPath();
        curCtx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
        curCtx.fill();
        t.alpha -= 0.02;
        t.size *= 0.96;
    }
    trail = trail.filter(t => t.alpha > 0);
    requestAnimationFrame(renderCanvas);
}
renderCanvas();
/* ==========================================
   3. INTRO TERMINAL LOADER
   ========================================== */
const logs = [
    "Initializing Friendship Engine...",
    "Loading Memories...",
    "Finding Best Friend...",
    "Checking Unlimited Bakchodi...",
    "Preparing Surprises...",
    "Loading... 100%",
    "✅ Best Friend Found ❤️"
];
let logIdx = 0;
const terminalEl = document.getElementById('terminal-logs');
const progressEl = document.getElementById('intro-progress');
function runIntroSequence() {
    if (logIdx < logs.length) {
        const p = document.createElement('div');
        p.textContent = "> " + logs[logIdx];
        terminalEl.appendChild(p);
        logIdx++;
        progressEl.style.width = Math.round((logIdx / logs.length) * 100) + '%';
        setTimeout(runIntroSequence, 450);
    } else {
        setTimeout(() => {
            const overlay = document.getElementById('intro-overlay');
            overlay.style.transition = 'opacity 0.8s ease';
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 800);
            initTypewriter();
        }, 600);
    }
}
window.addEventListener('DOMContentLoaded', runIntroSequence);
/* ==========================================
   4. HERO TYPEWRITER
   ========================================== */
function initTypewriter() {
    const phrases = [
        "The ultimate digital monument to unlimited bakchodi.",
        "Warning: 99% sarcasm and 100% genuine loyalty ahead.",
        "Scroll down to explore your official friendship bio-metrics!"
    ];
    let pIdx = 0, cIdx = 0, isDeleting = false;
    const target = document.getElementById('hero-typewriter');
    function type() {
        const current = phrases[pIdx];
        if (isDeleting) {
            target.textContent = current.substring(0, cIdx--);
        } else {
            target.textContent = current.substring(0, cIdx++);
        }
        let speed = isDeleting ? 30 : 60;
        if (!isDeleting && cIdx === current.length + 1) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && cIdx === 0) {
            isDeleting = false;
            pIdx = (pIdx + 1) % phrases.length;
            speed = 500;
        }
        setTimeout(type, speed);
    }
    type();
}
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
/* ==========================================
   5. SCANNER CONTROLLER
   ========================================== */
const scanBtn = document.getElementById('scan-trigger');
let scanTimer = null;
scanBtn.addEventListener('mousedown', startScan);
scanBtn.addEventListener('touchstart', startScan);
window.addEventListener('mouseup', endScan);
window.addEventListener('touchend', endScan);
function startScan(e) {
    e.preventDefault();
    scanBtn.classList.add('scanning');
    document.getElementById('scan-status').textContent = "Scanning Bio-Metrics...";
    SFX.playTone(400, 'sawtooth', 0.5);
    scanTimer = setTimeout(() => {
        document.getElementById('scan-status').textContent = "✅ Scan Complete!";
        document.getElementById('stat-loyalty').textContent = "999,999%";
        document.getElementById('stat-reply').textContent = "0.001 sec (If online)";
        document.getElementById('stat-bakchodi').textContent = "OVER 9000!";
        document.getElementById('stat-treat').textContent = "0.01% (Needs Push)";
        SFX.success();
        confetti();
        showNotification("Certified Best Friend ❤️");
    }, 2000);
}
function endScan() {
    if (scanTimer) clearTimeout(scanTimer);
    scanBtn.classList.remove('scanning');
    if (document.getElementById('scan-status').textContent !== "✅ Scan Complete!") {
        document.getElementById('scan-status').textContent = "Touch & Hold To Scan";
    }
}
/* ==========================================
   6. ROAST MACHINE CONTROLLER
   ========================================== */
const roasts = [
    "Reply itna late karta hai ki WhatsApp bhi confused ho jaata hai.",
    "Photo maangi thi... Network issue nahi... Friend issue tha.",
    "Treat ka naam sunte hi tera internet disconnect ho jaata hai.",
    "Tu online rehta hai... Bas reply offline mode me deta hai.",
    "Teri life me ek hi seriousness hai: PUBG/FreeFire ka match.",
    "Jitna dimaag tune padhai me lagaya, usse zyada bahane banane me lagaya hai.",
    "Tere saath ghoomna matlab apne izzat ki bali dena.",
    "Sirf tu hi hai jo reels bhejte waqt timing dekhta hai aur padhte waqt nahi."
];
let lastRoastIdx = -1;
function generateNextRoast() {
    let nextIdx;
    do {
        nextIdx = Math.floor(Math.random() * roasts.length);
    } while (nextIdx === lastRoastIdx);
    lastRoastIdx = nextIdx;
    const display = document.getElementById('roast-display');
    display.style.opacity = '0';
    setTimeout(() => {
        display.textContent = `"${roasts[nextIdx]}"`;
        display.style.opacity = '1';
    }, 200);
    unlockBadge('badge-2');
}
/* ==========================================
   7. COURT & WHEEL CONTROLLERS
   ========================================== */
const courtPunishments = [
    "Sentenced to buying 2 Large Pizzas immediately.",
    "Punishment: Must reply to all messages within 10 seconds for 1 week.",
    "Verdict: Guiltier than ever. Forced to send embarrassing throwback pic.",
    "Sentence: Must carry the friend's bag on the next trip."
];
function runCourtTrial() {
    const verdictEl = document.getElementById('court-verdict');
    verdictEl.textContent = "Judge is considering evidence...";
    setTimeout(() => {
        const choice = courtPunishments[Math.floor(Math.random() * courtPunishments.length)];
        verdictEl.textContent = choice;
        SFX.success();
    }, 800);
}
let wheelRotation = 0;
function spinLuckyWheel() {
    wheelRotation += 1440 + Math.floor(Math.random() * 360);
    const wheel = document.getElementById('spin-wheel');
    wheel.style.transform = `rotate(${wheelRotation}deg)`;
    SFX.playTone(800, 'sine', 0.3);
    setTimeout(() => {
        showNotification("Wheel stopped! Time to claim your treat! 🍕");
        confetti();
    }, 4000);
}
/* ==========================================
   8. GAMES CONTROLLER
   ========================================== */
let currentGame = 'catch';
let gameScore = 0;
let gameInterval = null;
function switchGame(type) {
    currentGame = type;
    const stage = document.getElementById('game-stage');
    stage.innerHTML = '';
    if (gameInterval) clearInterval(gameInterval);
    if (type === 'catch') {
        stage.innerHTML = `
            <div style="position: absolute; top: 15px; left: 20px; font-weight: bold; color: var(--accent-cyan);">Score: <span id="game-score">0</span></div>
            <div class="game-canvas-area" id="catch-area"></div>
        `;
        gameScore = 0;
        gameInterval = setInterval(spawnFallingHeart, 800);
    } else if (type === 'pop') {
        stage.innerHTML = `
            <div style="position: absolute; top: 15px; left: 20px; font-weight: bold; color: var(--accent-cyan);">Balloons Popped: <span id="game-score">0</span></div>
            <div class="game-canvas-area" id="pop-area"></div>
        `;
        gameScore = 0;
        gameInterval = setInterval(spawnBalloon, 700);
    } else if (type === 'memory') {
        initMemoryGame(stage);
    } else if (type === 'reaction') {
        initReactionGame(stage);
    }
    unlockBadge('badge-3');
}
function spawnFallingHeart() {
    const area = document.getElementById('catch-area');
    if (!area) return;
    const item = document.createElement('div');
    item.className = 'falling-item';
    item.textContent = '❤️';
    item.style.left = Math.random() * (area.clientWidth - 40) + 'px';
    item.style.top = '0px';
    area.appendChild(item);
    let pos = 0;
    const speed = Math.random() * 3 + 2;
    const fall = setInterval(() => {
        pos += speed;
        item.style.top = pos + 'px';
        if (pos > area.clientHeight - 40) {
            clearInterval(fall);
            item.remove();
        }
    }, 20);
    item.onclick = () => {
        clearInterval(fall);
        item.remove();
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        SFX.pop();
    };
}
function spawnBalloon() {
    const area = document.getElementById('pop-area');
    if (!area) return;
    const item = document.createElement('div');
    item.className = 'falling-item';
    item.textContent = '🎈';
    item.style.left = Math.random() * (area.clientWidth - 40) + 'px';
    item.style.top = (area.clientHeight - 40) + 'px';
    area.appendChild(item);
    let pos = area.clientHeight - 40;
    const speed = Math.random() * 3 + 2;
    const rise = setInterval(() => {
        pos -= speed;
        item.style.top = pos + 'px';
        if (pos < 0) {
            clearInterval(rise);
            item.remove();
        }
    }, 20);
    item.onclick = () => {
        clearInterval(rise);
        item.remove();
        gameScore++;
        document.getElementById('game-score').textContent = gameScore;
        SFX.pop();
    };
}
function initMemoryGame(stage) {
    stage.innerHTML = '<div class="memory-grid" id="mem-grid"></div>';
    const grid = document.getElementById('mem-grid');
    const icons = ['🍕','🍕','☕','☕','🎁','🎁','👑','👑'];
    icons.sort(() => Math.random() - 0.5);
    let flipped = [];
    icons.forEach((ic, idx) => {
        const card = document.createElement('div');
        card.className = 'memory-card-btn';
        card.dataset.icon = ic;
        card.dataset.idx = idx;
        card.textContent = '?';
        grid.appendChild(card);
        card.onclick = () => {
            if (flipped.length < 2 && !card.classList.contains('flipped')) {
                card.classList.add('flipped');
                card.textContent = ic;
                flipped.push(card);
                if (flipped.length === 2) {
                    if (flipped[0].dataset.icon === flipped[1].dataset.icon) {
                        SFX.success();
                        flipped = [];
                    } else {
                        setTimeout(() => {
                            flipped.forEach(c => {
                                c.classList.remove('flipped');
                                c.textContent = '?';
                            });
                            flipped = [];
                        }, 800);
                    }
                }
            }
        };
    });
}
function initReactionGame(stage) {
    stage.innerHTML = `
        <button class="btn-glow" id="react-btn" style="width: 200px; height: 200px; border-radius: 50%; font-size: 1.2rem;">Wait for Green...</button>
    `;
    const btn = document.getElementById('react-btn');
    let startTime;
    const delay = Math.random() * 3000 + 2000;
    const timer = setTimeout(() => {
        btn.style.background = '#10b981';
        btn.textContent = 'CLICK NOW!';
        startTime = Date.now();
    }, delay);
    btn.onclick = () => {
        if (!startTime) {
            clearTimeout(timer);
            btn.textContent = 'Too Early! Try Again.';
        } else {
            const elapsed = Date.now() - startTime;
            btn.textContent = `${elapsed} ms! Great Reflexes!`;
            SFX.success();
        }
    };
}
// Initialize default game
switchGame('catch');
/* ==========================================
   9. QUIZ CONTROLLER
   ========================================== */
const quizData = [
    {
        q: "What is your best friend's most common phrase?",
        opts: ["'Bhai treat kab de raha hai?'", "'Bas 5 min me pahunch raha hu'", "'Mera mood nahi hai'", "All of the above"]
    }
];
function loadQuiz() {
    const container = document.getElementById('quiz-container');
    const item = quizData[0];
    container.innerHTML = `
        <h3 style="font-size: 1.3rem; color: #fff;">${item.q}</h3>
        <div class="quiz-options">
            ${item.opts.map((o, i) => `<button class="quiz-opt-btn" onclick="answerQuiz(${i})">${o}</button>`).join('')}
        </div>
    `;
}
loadQuiz();
function answerQuiz(idx) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = `
        <h3 style="color: var(--accent-cyan); margin-bottom: 15px;">Result: 100% Certified Drama Queen / King 👑</h3>
        <p style="color: var(--text-muted); line-height: 1.6;">You guys have achieved maximum friendship synchronization. No further analysis needed!</p>
    `;
    SFX.success();
    confetti();
}
/* ==========================================
   10. CHAT CONTROLLER
   ========================================== */
const chatMsgs = [
    { type: 'received', text: 'Bhai sun' },
    { type: 'sent', text: 'Haan bol kya hua?' },
    { type: 'received', text: 'Emergency hai jaldi reply kar!' },
    { type: 'sent', text: 'Kya hua sab theek??' },
    { type: 'received', text: '50 rupay UPI kar de momos khane hain 🍕' }
];
function renderChat() {
    const body = document.getElementById('chat-body');
    body.innerHTML = '';
    chatMsgs.forEach((m, i) => {
        setTimeout(() => {
            const div = document.createElement('div');
            div.className = `chat-msg ${m.type}`;
            div.innerHTML = `${m.text} <div class="chat-time">2:0${i} AM</div>`;
            body.appendChild(div);
            body.scrollTop = body.scrollHeight;
            SFX.pop();
        }, i * 1200);
    });
}
// Trigger chat when scrolled into view
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        renderChat();
        observer.disconnect();
    }
}, { threshold: 0.5 });
observer.observe(document.getElementById('whatsapp'));
/* ==========================================
   11. SECRET VAULT CONTROLLER
   ========================================== */
function unlockVault() {
    const val = document.getElementById('vault-pass-input').value.trim().toUpperCase();
    if (val === 'FRIEND') {
        document.getElementById('letter-wrapper').style.display = 'flex';
        SFX.success();
        confetti();
        showNotification("Secret Vault Unlocked! 🔓");
        unlockBadge('badge-4');
    } else {
        alert("Incorrect Passcode! Hint: FRIEND");
    }
}
/* ==========================================
   12. CERTIFICATE CANVAS GENERATOR
   ========================================== */
function renderCertificate() {
    const canvas = document.getElementById('cert-canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    // Inner Border
    ctx.strokeStyle = '#ff2a85';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("CERTIFICATE OF BEST FRIENDSHIP", canvas.width / 2, 90);
    ctx.fillStyle = '#00f2fe';
    ctx.font = '18px Outfit, sans-serif';
    ctx.fillText("This official document certifies that", canvas.width / 2, 140);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 40px Outfit, sans-serif';
    ctx.fillText("YOU & ISHAAN 💙", canvas.width / 2, 210);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '16px Outfit, sans-serif';
    ctx.fillText("Are officially bonded for life with unlimited Bakchodi rights,", canvas.width / 2, 270);
    ctx.fillText("unbreakable loyalty, and lifelong treat obligations.", canvas.width / 2, 300);
    // Stamp
    ctx.strokeStyle = '#ff2a85';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 390, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#ff2a85';
    ctx.font = 'bold 12px Sora, sans-serif';
    ctx.fillText("OFFICIAL", canvas.width / 2, 385);
    ctx.fillText("STAMP", canvas.width / 2, 400);
}
window.addEventListener('load', renderCertificate);
function downloadCertificate() {
    const canvas = document.getElementById('cert-canvas');
    const link = document.createElement('a');
    link.download = 'Friendship_Certificate.png';
    link.href = canvas.toDataURL();
    link.click();
}
/* ==========================================
   13. UTILITIES & ACHIEVEMENTS
   ========================================== */
function showNotification(msg) {
    const container = document.getElementById('notification-container');
    const toast = document.createElement('div');
    toast.className = 'toast-notif';
    toast.innerHTML = `<i class="fas fa-bell" style="color: var(--accent-cyan);"></i> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}
function unlockBadge(id) {
    const b = document.getElementById(id);
    if (b) b.classList.add('unlocked');
}
function triggerGrandFinale() {
    const outro = document.getElementById('final-outro');
    const quoteEl = document.getElementById('outro-quote');
    outro.style.display = 'flex';
    setTimeout(() => outro.style.opacity = '1', 50);
    const text = "Some friends become memories. Some memories become stories. But real friends become family.";
    let i = 0;
    quoteEl.textContent = '';
    
    function typeOutro() {
        if (i < text.length) {
            quoteEl.textContent += text.charAt(i);
            i++;
            setTimeout(typeOutro, 50);
        }
    }
    typeOutro();
    // Fireworks confetti loop
    const duration = 5 * 1000;
    const end = Date.now() + duration;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}
