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

// // Mobile Buttons
// const btnLeft = document.getElementById('btnLeft');
// const btnRight = document.getElementById('btnRight');
// const btnUp = document.getElementById('btnUp');
// const btnShoot = document.getElementById('btnShoot');

// const canvas = document.getElementById('gameCanvas');
// const ctx = canvas.getContext('2d');
// const scoreboardDiv = document.getElementById('scoreboard');

// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// let gameActive = false;

// // --- BUTTON LISTENERS ---
// createBtn.addEventListener('click', () => {
//     const name = usernameInput.value || "Player";
//     socket.emit('createGame', name);
// });

// joinBtn.addEventListener('click', () => {
//     const code = roomCodeInput.value.toUpperCase();
//     const name = usernameInput.value || "Player";
//     if(code) {
//         socket.emit('joinGame', { code, name });
//     } else {
//         errorMsg.innerText = "Please enter a Room Code";
//     }
// });

// restartBtn.addEventListener('click', () => {
//     socket.emit('requestRestart');
//     restartBtn.innerText = "Waiting for server...";
// });

// // --- SERVER EVENTS ---
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
// });

// socket.on('gameRestarted', () => {
//     gameOverModal.style.display = 'none';
//     canvas.focus();
// });

// // --- INPUTS HANDLING (Keyboard + Touch) ---
// const inputs = { up: false, left: false, right: false };

// // Helper to send updates
// function sendInput() {
//     if (!gameActive) return;
//     socket.emit('input', inputs);
// }

// // --- A. KEYBOARD ---
// document.addEventListener('keydown', (e) => {
//     if (!gameActive) return;
//     if(['ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

//     if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = true;
//     if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = true;
//     if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = true;
    
//     if (e.key === ' ' || e.key === 'Spacebar') socket.emit('shoot');
    
//     sendInput();
// });

// document.addEventListener('keyup', (e) => {
//     if (!gameActive) return;
//     if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = false;
//     if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = false;
//     if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = false;
//     sendInput();
// });

// // --- B. MOBILE TOUCH ---
// // Function to handle Touch Start
// function handleTouchStart(e, key) {
//     e.preventDefault(); // Browser ka zoom/scroll roko
//     if (key === 'shoot') {
//         if(gameActive) socket.emit('shoot');
//     } else {
//         inputs[key] = true;
//         sendInput();
//     }
// }

// // Function to handle Touch End
// function handleTouchEnd(e, key) {
//     e.preventDefault();
//     if (key !== 'shoot') {
//         inputs[key] = false;
//         sendInput();
//     }
// }

// // Add Listeners to Mobile Buttons
// if(btnLeft) {
//     btnLeft.addEventListener('touchstart', (e) => handleTouchStart(e, 'left'));
//     btnLeft.addEventListener('touchend', (e) => handleTouchEnd(e, 'left'));
    
//     btnRight.addEventListener('touchstart', (e) => handleTouchStart(e, 'right'));
//     btnRight.addEventListener('touchend', (e) => handleTouchEnd(e, 'right'));
    
//     btnUp.addEventListener('touchstart', (e) => handleTouchStart(e, 'up'));
//     btnUp.addEventListener('touchend', (e) => handleTouchEnd(e, 'up'));
    
//     btnShoot.addEventListener('touchstart', (e) => handleTouchStart(e, 'shoot'));
// }

// // --- RENDER LOOP ---
// socket.on('gameState', (state) => {
    
//     // Waiting Screen Logic
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

//     // Clear Screen
//     ctx.fillStyle = "#050505";
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // Timer
//     const minutes = Math.floor(timer / 60);
//     const seconds = Math.floor(timer % 60);
//     if(timerDisplay) {
//         timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
//     }

//     // Asteroids
//     ctx.strokeStyle = '#777';
//     ctx.lineWidth = 2;
//     asteroids.forEach(a => {
//         ctx.beginPath();
//         ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
//         ctx.stroke();
//     });

//     // Bullets
//     ctx.fillStyle = '#fff';
//     ctx.shadowBlur = 10;
//     ctx.shadowColor = '#fff';
//     bullets.forEach(b => {
//         ctx.beginPath();
//         ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
//         ctx.fill();
//     });

//     // Ships
//     let scoreHTML = '';
//     for (const id in players) {
//         const p = players[id];
//         const isMe = id === socket.id;
        
//         if (!p.eliminated) {
//             drawShip(p.x, p.y, p.angle, isMe, p.name);
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
// });

// function drawShip(x, y, angle, isMe, name) {
//     ctx.save();
//     ctx.translate(x, y);
//     ctx.fillStyle = "white";
//     ctx.font = "12px monospace";
//     ctx.textAlign = "center";
//     ctx.shadowBlur = 0; 
//     ctx.fillText(name, 0, -25);
//     ctx.rotate(angle);
//     const color = isMe ? '#00ffff' : '#ff0055';
//     ctx.strokeStyle = color;
//     ctx.shadowColor = color;
//     ctx.shadowBlur = 15;
//     ctx.lineWidth = 2;
//     ctx.beginPath();
//     ctx.moveTo(20, 0);
//     ctx.lineTo(-15, 10);
//     ctx.lineTo(-15, -10);
//     ctx.closePath();
//     ctx.stroke();
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
const displayCode = document.getElementById('displayCode');
const errorMsg = document.getElementById('errorMsg');
const timerDisplay = document.getElementById('timerDisplay');
const gameOverModal = document.getElementById('gameOverModal');
const winnerText = document.getElementById('winnerText');
const restartBtn = document.getElementById('restartBtn');
const waitingScreen = document.getElementById('waitingScreen');

// Mobile Buttons
const btnLeft = document.getElementById('btnLeft');
const btnRight = document.getElementById('btnRight');
const btnUp = document.getElementById('btnUp');
const btnShoot = document.getElementById('btnShoot');

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboardDiv = document.getElementById('scoreboard');

// SERVER WORLD SIZE (Ye wahi hona chahiye jo server.js me hai)
const SERVER_WIDTH = 800;
const SERVER_HEIGHT = 600;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameActive = false;
let shootInterval = null; // Continuous shooting ke liye

// --- BUTTON LISTENERS ---
createBtn.addEventListener('click', () => {
    const name = usernameInput.value || "Player";
    socket.emit('createGame', name);
});

joinBtn.addEventListener('click', () => {
    const code = roomCodeInput.value.toUpperCase();
    const name = usernameInput.value || "Player";
    if(code) {
        socket.emit('joinGame', { code, name });
    } else {
        errorMsg.innerText = "Please enter a Room Code";
    }
});

restartBtn.addEventListener('click', () => {
    socket.emit('requestRestart');
    restartBtn.innerText = "Waiting for server...";
});

// --- SERVER EVENTS ---
socket.on('gameCode', (code) => {
    loginScreen.style.display = 'none';
    gameUI.style.display = 'block';
    displayCode.innerText = code;
    gameActive = true;
});

socket.on('unknownCode', () => errorMsg.innerText = "Unknown Room Code");
socket.on('tooManyPlayers', () => errorMsg.innerText = "Room is Full");

socket.on('gameOver', (winnerName) => {
    gameOverModal.style.display = 'block';
    winnerText.innerText = `${winnerName} WINS!`;
    restartBtn.innerText = "Play Again";
    
    // Stop shooting if game over
    if(shootInterval) clearInterval(shootInterval);
});

socket.on('gameRestarted', () => {
    gameOverModal.style.display = 'none';
    canvas.focus();
});

// --- INPUTS HANDLING (Keyboard + Touch) ---
const inputs = { up: false, left: false, right: false };

function sendInput() {
    if (!gameActive) return;
    socket.emit('input', inputs);
}

// A. KEYBOARD
document.addEventListener('keydown', (e) => {
    if (!gameActive) return;
    if(['ArrowUp', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();

    if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = true;
    if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = true;
    if (e.key === ' ' || e.key === 'Spacebar') socket.emit('shoot');
    
    sendInput();
});

document.addEventListener('keyup', (e) => {
    if (!gameActive) return;
    if (e.key === 'ArrowUp' || e.key === 'w') inputs.up = false;
    if (e.key === 'ArrowLeft' || e.key === 'a') inputs.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') inputs.right = false;
    sendInput();
});

// B. MOBILE TOUCH (Continuous Logic Updated)
function handleTouchStart(e, key) {
    e.preventDefault(); 
    if (!gameActive) return;

    if (key === 'shoot') {
        // 1. Turant goli chalao
        socket.emit('shoot');
        // 2. Machine Gun Mode: Har 150ms me goli chalao
        if(shootInterval) clearInterval(shootInterval);
        shootInterval = setInterval(() => {
            socket.emit('shoot');
        }, 150); // Speed adjust kar sakte ho
    } else {
        // Movement: State true karo (Server loop handle karega)
        inputs[key] = true;
        sendInput();
    }
}

function handleTouchEnd(e, key) {
    e.preventDefault();
    if (key === 'shoot') {
        // Goli chalana band karo
        if(shootInterval) clearInterval(shootInterval);
        shootInterval = null;
    } else {
        // Movement roko
        inputs[key] = false;
        sendInput();
    }
}

// Listeners add karo
if(btnLeft) {
    // Touchstart = Button dabaya
    btnLeft.addEventListener('touchstart', (e) => handleTouchStart(e, 'left'));
    btnRight.addEventListener('touchstart', (e) => handleTouchStart(e, 'right'));
    btnUp.addEventListener('touchstart', (e) => handleTouchStart(e, 'up'));
    btnShoot.addEventListener('touchstart', (e) => handleTouchStart(e, 'shoot'));

    // Touchend = Button choda
    btnLeft.addEventListener('touchend', (e) => handleTouchEnd(e, 'left'));
    btnRight.addEventListener('touchend', (e) => handleTouchEnd(e, 'right'));
    btnUp.addEventListener('touchend', (e) => handleTouchEnd(e, 'up'));
    btnShoot.addEventListener('touchend', (e) => handleTouchEnd(e, 'shoot'));
}

// --- RENDER LOOP (WITH SCALING) ---
socket.on('gameState', (state) => {
    
    // --- SCALING CALCULATIONS (New) ---
    // Hum check karenge ki mobile screen kitni choti hai Server World (800x600) ke mukable
    const scaleX = canvas.width / SERVER_WIDTH;
    const scaleY = canvas.height / SERVER_HEIGHT;
    
    // Dono me se jo chota scale hai wo use karenge taki aspect ratio kharab na ho
    // Ya fir 'stretch' karne ke liye alag alag use kar sakte hain. 
    // Best hai: Full fit (Stretch) taki screen se bahar kuch na jaye.
    
    // Waiting Screen
    if (!state.active) {
        waitingScreen.style.display = 'block'; 
        ctx.fillStyle = "#050505";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        let joinedHTML = '<h3 style="color:white; margin-top:50px;">Players Joined:</h3>';
        for (const id in state.players) {
            joinedHTML += `<div style="color: #0ff;">${state.players[id].name}</div>`;
        }
        waitingScreen.innerHTML = `<h2 class="glow">WAITING FOR PLAYER 2...</h2>
                                   <p>Room Code: <span style="color:#0ff; font-size:24px;">${displayCode.innerText}</span></p>
                                   ${joinedHTML}`;
        return; 
    } else {
        waitingScreen.style.display = 'none';
    }

    const { players, bullets, asteroids, timer } = state;

    // Clear Screen
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // --- ZOOM START ---
    ctx.save(); // Current settings save karo
    ctx.scale(scaleX, scaleY); // Puri duniya ko mobile screen size me fit karo

    // Asteroids
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 2;
    asteroids.forEach(a => {
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.stroke();
    });

    // Bullets
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Ships
    let scoreHTML = '';
    for (const id in players) {
        const p = players[id];
        const isMe = id === socket.id;
        
        if (!p.eliminated) {
            drawShip(p.x, p.y, p.angle, isMe, p.name);
        }

        const color = isMe ? '#00ffff' : '#ff0055';
        const livesIcon = "❤️".repeat(p.lives);
        const status = p.eliminated ? "(DEAD)" : "";
        
        scoreHTML += `<div style="color: ${color}; margin-bottom: 5px;">
                        ${p.name} ${status}<br>
                        Score: ${p.score} | Lives: ${livesIcon}
                      </div>`;
    }
    if(scoreboardDiv) scoreboardDiv.innerHTML = scoreHTML;

    // --- ZOOM END ---
    ctx.restore(); // Wapas normal settings par aao taki UI kharab na ho

    // Timer (UI iske upar draw hoga, scale se effect nahi hoga kyunki HTML div hai)
    const minutes = Math.floor(timer / 60);
    const seconds = Math.floor(timer % 60);
    if(timerDisplay) {
        timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0'+seconds : seconds}`;
    }
});

function drawShip(x, y, angle, isMe, name) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = "white";
    ctx.font = "14px monospace"; // Font thoda bada kiya
    ctx.textAlign = "center";
    ctx.shadowBlur = 0; 
    // Name ko thoda upar adjust kiya taki scale hone par bhi dikhe
    ctx.fillText(name, 0, -30);
    
    ctx.rotate(angle);
    const color = isMe ? '#00ffff' : '#ff0055';
    ctx.strokeStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(-15, 10);
    ctx.lineTo(-15, -10);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});