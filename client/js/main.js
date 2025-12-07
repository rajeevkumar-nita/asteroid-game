// const socket = io();

// // UI Elements
// const loginScreen = document.getElementById('loginScreen');
// const gameUI = document.getElementById('gameUI');
// const usernameInput = document.getElementById('usernameInput');
// const roomCodeInput = document.getElementById('roomCodeInput');
// const createBtn = document.getElementById('createBtn');
// const joinBtn = document.getElementById('joinBtn');
// const displayCode = document.getElementById('displayCode');
// const errorMsg = document.getElementById('errorMsg');
// const timerDisplay = document.getElementById('timerDisplay');
// const gameOverModal = document.getElementById('gameOverModal');
// const winnerText = document.getElementById('winnerText');
// const restartBtn = document.getElementById('restartBtn');
// const waitingScreen = document.getElementById('waitingScreen');

// const btnLeft = document.getElementById('btnLeft');
// const btnRight = document.getElementById('btnRight');
// const btnUp = document.getElementById('btnUp');
// const btnShoot = document.getElementById('btnShoot');

// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// const scoreboardDiv = document.getElementById('scoreboard');

// const SERVER_WIDTH = 800;
// const SERVER_HEIGHT = 600;

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let gameActive = false;
// let shootInterval = null; 

// // --- GENERATE STARS (Space Background) ---
// const stars = [];
// // 100 Random stars create kar rahe hain
// for(let i = 0; i < 100; i++) {
//     stars.push({
//         x: Math.random() * SERVER_WIDTH,
//         y: Math.random() * SERVER_HEIGHT,
//         size: Math.random() * 2 + 1, // Size 1 se 3
//         alpha: Math.random() // Chamak (Opacity)
//     });
// }

// // --- SOUND ---
// const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// function playLaserSound() {
//     if (audioCtx.state === 'suspended') audioCtx.resume(); 
//     const oscillator = audioCtx.createOscillator();
//     const gainNode = audioCtx.createGain();
    
//     oscillator.type = 'sawtooth'; 
//     oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); 
//     oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.15); 
    
//     gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);

//     oscillator.connect(gainNode);
//     gainNode.connect(audioCtx.destination);
    
//     oscillator.start();
//     oscillator.stop(audioCtx.currentTime + 0.15);
// }

// // --- BUTTON LISTENERS ---
// createBtn.addEventListener('click', () => {
//     const name = usernameInput.value || "Player";
//     socket.emit('createGame', name);
//     if (audioCtx.state === 'suspended') audioCtx.resume();
// });

// joinBtn.addEventListener('click', () => {
//     const code = roomCodeInput.value.toUpperCase();
//     const name = usernameInput.value || "Player";
//     if(code) {
//         socket.emit('joinGame', { code, name });
//         if (audioCtx.state === 'suspended') audioCtx.resume();
//     } else {
//         errorMsg.innerText = "Please enter a Room Code";
//     }
// });

// restartBtn.addEventListener('click', () => {
//     socket.emit('requestRestart');
//     restartBtn.innerText = "Waiting for server...";
// });

// socket.on('gameCode', (code) => {
//     loginScreen.style.display = 'none';
//     gameUI.style.display = 'block';
//     displayCode.innerText = code;
//     gameActive = true;
// });
// socket.on('unknownCode', () => errorMsg.innerText = "Unknown Room Code");
// socket.on('tooManyPlayers', () => errorMsg.innerText = "Room is Full");
// socket.on('gameOver', (winnerName) => {
//     gameOverModal.style.display = 'block';
//     winnerText.innerText = `${winnerName} WINS!`;
//     restartBtn.innerText = "Play Again";
//     if(shootInterval) clearInterval(shootInterval);
// });
// socket.on('gameRestarted', () => {
//     gameOverModal.style.display = 'none';
//     canvas.focus();
// });

// // --- INPUTS ---
// const inputs = { up: false, left: false, right: false };
// function sendInput() {
//     if (!gameActive) return;
//     socket.emit('input', inputs);
// }

// document.addEventListener('keydown', (e) => {
//     if (!gameActive) return;
//     if(['ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
//     if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = true;
//     if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = true;
//     if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = true;
//     if (e.key === ' ' || e.key === 'Spacebar') {
//         socket.emit('shoot');
//         playLaserSound(); 
//     }
//     sendInput();
// });
// document.addEventListener('keyup', (e) => {
//     if (!gameActive) return;
//     if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = false;
//     if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = false;
//     if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = false;
//     sendInput();
// });

// function bindTouch(btn, key) {
//     if(!btn) return;
//     btn.addEventListener('touchstart', (e) => {
//         e.preventDefault();
//         if (!gameActive) return;
//         if (key === 'shoot') {
//             socket.emit('shoot');
//             playLaserSound(); 
//             if(shootInterval) clearInterval(shootInterval);
//             shootInterval = setInterval(() => {
//                 socket.emit('shoot');
//                 playLaserSound(); 
//             }, 150);
//         } else {
//             inputs[key] = true;
//             sendInput();
//         }
//     }, { passive: false });
//     btn.addEventListener('touchend', (e) => {
//         e.preventDefault();
//         if (key === 'shoot') {
//             if(shootInterval) clearInterval(shootInterval);
//             shootInterval = null;
//         } else {
//             inputs[key] = false;
//             sendInput();
//         }
//     }, { passive: false });
// }
// bindTouch(btnLeft, 'left');
// bindTouch(btnRight, 'right');
// bindTouch(btnUp, 'up');
// bindTouch(btnShoot, 'shoot');

// // --- RENDER LOOP ---
// socket.on('gameState', (state) => {
//     const scaleX = canvas.width / SERVER_WIDTH;
//     const scaleY = canvas.height / SERVER_HEIGHT;
    
//     if (!state.active) {
//         waitingScreen.style.display = 'block'; 
//         ctx.fillStyle = "#050505";
//         ctx.fillRect(0, 0, canvas.width, canvas.height);
//         let joinedHTML = '<h3 style="color:white; margin-top:50px;">Players Joined:</h3>';
//         for (const id in state.players) {
//             joinedHTML += `<div style="color: #0ff;">${state.players[id].name}</div>`;
//         }
//         waitingScreen.innerHTML = `<h2 class="glow">WAITING FOR PLAYER 2...</h2>
//                                    <p>Room Code: <span style="color:#0ff; font-size:24px;">${displayCode.innerText}</span></p>
//                                    ${joinedHTML}`;
//         return; 
//     } else {
//         waitingScreen.style.display = 'none';
//     }

//     const { players, bullets, asteroids, timer } = state;

//     // --- 1. SPACE BACKGROUND ---
//     // Deep Space Gradient
//     const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
//     grad.addColorStop(0, '#020010'); // Dark Blue/Black
//     grad.addColorStop(1, '#090015'); // Slightly lighter
//     ctx.fillStyle = grad;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     ctx.save();
//     ctx.scale(scaleX, scaleY);

//     // Draw Stars
//     ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
//     stars.forEach(star => {
//         ctx.globalAlpha = Math.random() * 0.5 + 0.3; // Twinkle Effect
//         ctx.fillRect(star.x, star.y, star.size, star.size);
//     });
//     ctx.globalAlpha = 1.0; // Reset alpha

//     // --- 2. THICKER ASTEROIDS ---
//     ctx.strokeStyle = '#fff';
//     ctx.lineWidth = 4; // Mota kiya (2 -> 4)
//     ctx.shadowBlur = 10;
//     ctx.shadowColor = '#00ffcc'; 

//     asteroids.forEach(a => {
//         ctx.beginPath();
//         if (a.vertices && a.vertices.length > 0) {
//             ctx.moveTo(a.x + a.vertices[0].x, a.y + a.vertices[0].y);
//             for (let i = 1; i < a.vertices.length; i++) {
//                 ctx.lineTo(a.x + a.vertices[i].x, a.y + a.vertices[i].y);
//             }
//         } else {
//             ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
//         }
//         ctx.closePath();
//         ctx.stroke();
//     });

//     // --- 3. BIGGER BULLETS ---
//     ctx.shadowColor = '#fff';
//     ctx.fillStyle = '#fff';
//     bullets.forEach(b => {
//         ctx.beginPath();
//         // Radius bada kiya (3 -> 6)
//         ctx.arc(b.x, b.y, 6, 0, Math.PI * 2); 
//         ctx.fill();
//     });

//     let scoreHTML = '';
//     for (const id in players) {
//         const p = players[id];
//         const isMe = id === socket.id;
        
//         if (!p.eliminated) {
//             draw3DShip(p.x, p.y, p.angle, isMe, p.name);
//         }

//         const color = isMe ? '#00ffff' : '#ff0055';
//         const livesIcon = "❤️".repeat(p.lives);
//         const status = p.eliminated ? "(DEAD)" : "";
//         scoreHTML += `<div style="color: ${color}; margin-bottom: 5px;">
//                         ${p.name} ${status}<br>
//                         Score: ${p.score} | Lives: ${livesIcon}
//                       </div>`;
//     }
//     if(scoreboardDiv) scoreboardDiv.innerHTML = scoreHTML;

//     ctx.restore();

//     const minutes = Math.floor(timer / 60);
//     const seconds = Math.floor(timer % 60);
//     if(timerDisplay) {
//         timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
//     }
// });

// // --- THICKER 3D SHIP ---
// function draw3DShip(x, y, angle, isMe, name) {
//     ctx.save();
//     ctx.translate(x, y);
    
//     ctx.fillStyle = "white";
//     ctx.font = "14px monospace";
//     ctx.textAlign = "center";
//     ctx.shadowBlur = 0; 
//     ctx.fillText(name, 0, -35);
    
//     ctx.rotate(angle);
//     const color = isMe ? '#00ffff' : '#ff0055'; 
//     ctx.strokeStyle = color;
//     ctx.lineWidth = 4; // Ship lines bhi moti ki (2 -> 4)
    
//     ctx.shadowBlur = 15;
//     ctx.shadowColor = color;

//     // Body
//     ctx.beginPath();
//     ctx.moveTo(25, 0);       
//     ctx.lineTo(-20, 15);     
//     ctx.lineTo(-10, 0);      
//     ctx.lineTo(-20, -15);    
//     ctx.closePath();
//     ctx.stroke();

//     // Ridge
//     ctx.beginPath();
//     ctx.moveTo(25, 0);
//     ctx.lineTo(-10, 0);
//     ctx.stroke();

//     // Cockpit
//     ctx.beginPath();
//     ctx.moveTo(5, 0);
//     ctx.lineTo(-5, 0);
//     ctx.lineWidth = 6; // Cockpit aur mota
//     ctx.stroke();

//     // Fire (Badi aag)
//     if(inputs.up && isMe) { 
//         ctx.beginPath();
//         ctx.moveTo(-12, 0);
//         ctx.lineTo(-40, 0); // Lambi aag
//         ctx.strokeStyle = '#ffaa00'; 
//         ctx.shadowColor = '#ffaa00';
//         ctx.lineWidth = 4;
//         ctx.stroke();
//     }

//     ctx.restore();
// }

// window.addEventListener('resize', () => {
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
// });






const socket = io();

// UI Elements
const loginScreen = document.getElementById('loginScreen');
const gameUI = document.getElementById('gameUI');
const usernameInput = document.getElementById('usernameInput');
const roomCodeInput = document.getElementById('roomCodeInput');
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const errorMsg = document.getElementById('errorMsg');

// New HUD Elements
const p1Name = document.getElementById('p1Name');
const p1Score = document.getElementById('p1Score');
const p1Lives = document.getElementById('p1Lives');
const p2Name = document.getElementById('p2Name');
const p2Score = document.getElementById('p2Score');
const p2Lives = document.getElementById('p2Lives');
const gameTimer = document.getElementById('gameTimer');
const roomTag = document.getElementById('roomTag');

// Modals
const gameOverModal = document.getElementById('gameOverModal');
const winnerText = document.getElementById('winnerText');
const restartBtn = document.getElementById('restartBtn');
const waitingScreen = document.getElementById('waitingScreen');
const waitCode = document.getElementById('waitCode');

// Controls
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnUp = document.getElementById('btnUp');
const btnShoot = document.getElementById('btnShoot');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const SERVER_WIDTH = 800;
const SERVER_HEIGHT = 600;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameActive = false;
let shootInterval = null; 

// --- STARS (Background) ---
const stars = [];
for(let i = 0; i < 80; i++) {
    stars.push({
        x: Math.random() * SERVER_WIDTH,
        y: Math.random() * SERVER_HEIGHT,
        size: Math.random() * 2,
        alpha: Math.random()
    });
}

// --- SOUND ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playLaserSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume(); 
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sawtooth'; 
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime); 
    oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1); 
    gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.1);
}

// --- BUTTON LOGIC ---
createBtn.addEventListener('click', () => {
    const name = usernameInput.value || "PILOT";
    socket.emit('createGame', name);
    if (audioCtx.state === 'suspended') audioCtx.resume();
});

joinBtn.addEventListener('click', () => {
    const code = roomCodeInput.value.toUpperCase();
    const name = usernameInput.value || "PILOT";
    if(code) {
        socket.emit('joinGame', { code, name });
        if (audioCtx.state === 'suspended') audioCtx.resume();
    } else {
        errorMsg.innerText = "ENTER MISSION CODE";
    }
});

restartBtn.addEventListener('click', () => {
    socket.emit('requestRestart');
    restartBtn.innerText = "SYNCING...";
});

// --- SOCKET EVENTS ---
socket.on('gameCode', (code) => {
    loginScreen.style.display = 'none';
    gameUI.style.display = 'block';
    roomTag.innerText = "ROOM: " + code;
    waitCode.innerText = code;
    gameActive = true;
});

socket.on('unknownCode', () => errorMsg.innerText = "INVALID CODE");
socket.on('tooManyPlayers', () => errorMsg.innerText = "MISSION FULL");

socket.on('gameOver', (winnerName) => {
    gameOverModal.style.display = 'block';
    winnerText.innerText = winnerName + " WINS";
    restartBtn.innerText = "REMATCH";
    if(shootInterval) clearInterval(shootInterval);
});

socket.on('gameRestarted', () => {
    gameOverModal.style.display = 'none';
    canvas.focus();
});

// --- CONTROLS ---
const inputs = { up: false, left: false, right: false };
function sendInput() { if (gameActive) socket.emit('input', inputs); }

document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if(['ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
    if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = true;
    if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = true;
    if (e.key === ' ' || e.key === 'Spacebar') { socket.emit('shoot'); playLaserSound(); }
    sendInput();
});
document.addEventListener('keyup', (e) => {
    if (!gameActive) return;
    if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = false;
    sendInput();
});

function bindTouch(btn, key) {
    if(!btn) return;
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault(); if (!gameActive) return;
        if (key === 'shoot') {
            socket.emit('shoot'); playLaserSound();
            if(shootInterval) clearInterval(shootInterval);
            shootInterval = setInterval(() => { socket.emit('shoot'); playLaserSound(); }, 150);
        } else { inputs[key] = true; sendInput(); }
    }, { passive: false });
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        if (key === 'shoot') { if(shootInterval) clearInterval(shootInterval); shootInterval = null; }
        else { inputs[key] = false; sendInput(); }
    }, { passive: false });
}
bindTouch(btnLeft, 'left'); bindTouch(btnRight, 'right');
bindTouch(btnUp, 'up'); bindTouch(btnShoot, 'shoot');

// --- RENDER LOOP ---
socket.on('gameState', (state) => {
    const scaleX = canvas.width / SERVER_WIDTH;
    const scaleY = canvas.height / SERVER_HEIGHT;
    
    // WAITING LOGIC
    if (!state.active) {
        waitingScreen.style.display = 'block'; 
        ctx.fillStyle = "#050010"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        return; 
    } else {
        waitingScreen.style.display = 'none';
    }

    // --- HUD UPDATE ---
    const { players, bullets, asteroids, timer } = state;
    
    // Find ME and OPPONENT
    const myId = socket.id;
    const me = players[myId];
    // Find keys that are not my ID
    const opponentId = Object.keys(players).find(id => id !== myId);
    const opponent = players[opponentId];

    // Update ME (Left Panel)
    if(me) {
        p1Name.innerText = me.name;
        p1Score.innerText = me.score;
        p1Lives.innerText = "♥".repeat(me.lives); // Or use styled bars
    }

    // Update OPPONENT (Right Panel)
    if(opponent) {
        p2Name.innerText = opponent.name;
        p2Score.innerText = opponent.score;
        p2Lives.innerText = "♥".repeat(opponent.lives);
    } else {
        p2Name.innerText = "DISCONNECTED";
        p2Score.innerText = "---";
        p2Lives.innerText = "";
    }

    // Update Timer
    const mins = Math.floor(timer / 60);
    const secs = Math.floor(timer % 60);
    gameTimer.innerText = `${mins}:${secs < 10 ? '0'+secs : secs}`;

    // --- DRAWING ---
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#050010'); grad.addColorStop(1, '#100020');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(scaleX, scaleY);

    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    stars.forEach(s => ctx.fillRect(s.x, s.y, s.size, s.size));

    // Asteroids
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.shadowBlur = 8; ctx.shadowColor = '#00ffcc';
    asteroids.forEach(a => {
        ctx.beginPath();
        if (a.vertices) {
            ctx.moveTo(a.x + a.vertices[0].x, a.y + a.vertices[0].y);
            for (let i = 1; i < a.vertices.length; i++) ctx.lineTo(a.x + a.vertices[i].x, a.y + a.vertices[i].y);
        } else { ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2); }
        ctx.closePath(); ctx.stroke();
    });

    // Bullets
    ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff';
    bullets.forEach(b => {
        ctx.beginPath(); ctx.arc(b.x, b.y, 5, 0, Math.PI * 2); ctx.fill();
    });

    // Ships
    for (const id in players) {
        const p = players[id];
        if (!p.eliminated) {
            draw3DShip(p.x, p.y, p.angle, id === myId, p.name);
        }
    }

    ctx.restore();
});

// Helper for Ship
function draw3DShip(x, y, angle, isMe, name) {
    ctx.save(); ctx.translate(x, y);
    // Name is now in HUD, not above ship to keep it clean, 
    // or keep it if you want (commented out for cleaner look)
    // ctx.fillStyle = "white"; ctx.fillText(name, 0, -35);
    
    ctx.rotate(angle);
    const color = isMe ? '#00ffff' : '#ff0055';
    ctx.strokeStyle = color; ctx.lineWidth = 3;
    ctx.shadowBlur = 15; ctx.shadowColor = color;
    
    ctx.beginPath();
    ctx.moveTo(25, 0); ctx.lineTo(-20, 15); ctx.lineTo(-10, 0); ctx.lineTo(-20, -15);
    ctx.closePath(); ctx.stroke();
    
    // Engine Fire
    if(isMe && inputs.up) {
        ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-35, 0);
        ctx.strokeStyle = '#ffaa00'; ctx.stroke();
    }
    ctx.restore();
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});