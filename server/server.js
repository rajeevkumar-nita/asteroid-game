// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static(path.join(__dirname, '../client')));

// // --- GAME STATE ---
// const state = {}; 
// const clientRooms = {}; 

// function makeId(length) {
//     let result = '';
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

// function createAsteroid() {
//     return {
//         x: Math.random() * 800,
//         y: Math.random() * 600,
//         angle: Math.random() * Math.PI * 2,
//         speed: Math.random() * 2 + 1,
//         radius: Math.random() * 20 + 20
//     };
// }

// function initGame() {
//     const asteroids = [];
//     for (let i = 0; i < 5; i++) asteroids.push(createAsteroid());
//     return {
//         players: {},
//         bullets: [],
//         asteroids: asteroids,
//         timer: 120, 
//         isOver: false,
//         active: false // <--- NEW: Game shuru mein band rahega
//     };
// }

// io.on('connection', (socket) => {

//     // 1. CREATE GAME
//     socket.on('createGame', (name) => {
//         const roomCode = makeId(5);
//         clientRooms[socket.id] = roomCode;
//         state[roomCode] = initGame();

//         socket.join(roomCode);
//         state[roomCode].players[socket.id] = {
//             x: 200, y: 300, angle: 0, score: 0, name: name || "Player 1"
//         };

//         socket.emit('gameCode', roomCode);
//         socket.emit('init', 1);
//     });

//     // 2. JOIN GAME
//     socket.on('joinGame', ({ code, name }) => {
//         const room = io.sockets.adapter.rooms.get(code);
        
//         if (!room || room.size === 0 || !state[code]) {
//             socket.emit('unknownCode');
//             return;
//         }
//         if (room.size >= 2) {
//             socket.emit('tooManyPlayers');
//             return;
//         }

//         clientRooms[socket.id] = code;
//         socket.join(code);

//         state[code].players[socket.id] = {
//             x: 600, y: 300, angle: Math.PI, score: 0, name: name || "Player 2"
//         };
        
//         // <--- NEW: Player 2 aate hi game ACTIVE hoga
//         state[code].active = true; 

//         socket.emit('gameCode', code);
//         socket.emit('init', 2);
//     });

//     // 3. INPUT HANDLING
//     socket.on('input', (inputs) => {
//         const roomCode = clientRooms[socket.id];
//         if (!roomCode || !state[roomCode]) return;
        
//         // Agar Game active nahi hai ya Over hai, to input mat lo
//         if (!state[roomCode].active || state[roomCode].isOver) return;

//         const p = state[roomCode].players[socket.id];
//         if (p) {
//             if (inputs.left) p.angle -= 0.1;
//             if (inputs.right) p.angle += 0.1;
//             if (inputs.up) {
//                 p.x += Math.cos(p.angle) * 5;
//                 p.y += Math.sin(p.angle) * 5;
//             }
//         }
//     });

//     socket.on('shoot', () => {
//         const roomCode = clientRooms[socket.id];
//         if (!roomCode || !state[roomCode]) return;
//         if (!state[roomCode].active || state[roomCode].isOver) return;

//         const p = state[roomCode].players[socket.id];
//         if (p) {
//             state[roomCode].bullets.push({
//                 x: p.x, y: p.y, angle: p.angle, speed: 10, ownerId: socket.id, life: 60
//             });
//         }
//     });

//     // 4. RESTART GAME
//     socket.on('requestRestart', () => {
//         const roomCode = clientRooms[socket.id];
//         if (!roomCode || !state[roomCode]) return;
//         const gameState = state[roomCode];

//         if (gameState.isOver) {
//             gameState.isOver = false;
//             gameState.active = true; // Restart hone par Active rahega (kyunki dono players hain)
//             gameState.timer = 120;
//             gameState.bullets = [];
//             gameState.asteroids = [];
//             for (let i = 0; i < 5; i++) gameState.asteroids.push(createAsteroid());

//             const positions = [
//                 { x: 200, y: 300, angle: 0 },
//                 { x: 600, y: 300, angle: Math.PI }
//             ];
//             let idx = 0;
//             for (const id in gameState.players) {
//                 const p = gameState.players[id];
//                 p.score = 0;
//                 if (positions[idx]) {
//                     p.x = positions[idx].x;
//                     p.y = positions[idx].y;
//                     p.angle = positions[idx].angle;
//                 }
//                 idx++;
//             }
//             io.to(roomCode).emit('gameRestarted');
//         }
//     });

//     socket.on('disconnect', () => {
//         const roomCode = clientRooms[socket.id];
//         if (state[roomCode]) {
//              delete state[roomCode].players[socket.id];
//              // Agar Player chala gaya, to game ko INACTIVE kar do
//              state[roomCode].active = false;
             
//              if (Object.keys(state[roomCode].players).length === 0) {
//                  delete state[roomCode];
//              }
//         }
//         delete clientRooms[socket.id];
//     });
// });

// // --- GAME LOOP ---
// setInterval(() => {
//     for (const roomCode in state) {
//         const gameState = state[roomCode];
        
//         // <--- NEW: Agar Game Active nahi hai (Waiting Mode), to update mat karo
//         if (!gameState.active || gameState.isOver) {
//             // Still send state so clients see "Waiting..."
//             io.to(roomCode).emit('gameState', gameState);
//             continue;
//         }

//         // Timer Logic
//         gameState.timer -= 1/60;
//         if (gameState.timer <= 0) {
//             gameState.isOver = true;
//             gameState.timer = 0;
            
//             let winnerName = "Draw";
//             let players = Object.values(gameState.players);
//             if (players.length > 0) {
//                 players.sort((a, b) => b.score - a.score);
//                 if (players[0].score > (players[1]?.score || -1)) {
//                     winnerName = players[0].name;
//                 }
//             }
//             io.to(roomCode).emit('gameOver', winnerName);
//         }

//         const { players, bullets, asteroids } = gameState;

//         // Asteroids Move
//         asteroids.forEach(a => {
//             a.x += Math.cos(a.angle) * a.speed;
//             a.y += Math.sin(a.angle) * a.speed;
//             if (a.x > 850) a.x = -50; if (a.x < -50) a.x = 850;
//             if (a.y > 650) a.y = -50; if (a.y < -50) a.y = 650;
//         });

//         // Bullets & Collision
//         for (let i = bullets.length - 1; i >= 0; i--) {
//             const b = bullets[i];
//             b.x += Math.cos(b.angle) * b.speed;
//             b.y += Math.sin(b.angle) * b.speed;
//             b.life--;

//             let hit = false;
            
//             for (let j = asteroids.length - 1; j >= 0; j--) {
//                 const a = asteroids[j];
//                 if (Math.hypot(b.x - a.x, b.y - a.y) < a.radius) {
//                     if (players[b.ownerId]) players[b.ownerId].score += 10;
//                     asteroids.splice(j, 1);
//                     asteroids.push(createAsteroid());
//                     hit = true; break;
//                 }
//             }

//             if (!hit) {
//                 for (const pid in players) {
//                     if (b.ownerId !== pid) {
//                         const p = players[pid];
//                         if (Math.hypot(b.x - p.x, b.y - p.y) < 20) {
//                             players[b.ownerId].score += 50;
//                             p.x = Math.random() * 800;
//                             p.y = Math.random() * 600;
//                             hit = true; break;
//                         }
//                     }
//                 }
//             }

//             if (hit || b.life <= 0) bullets.splice(i, 1);
//         }

//         io.to(roomCode).emit('gameState', gameState);
//     }
// }, 1000 / 60);

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });






const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../client')));

// --- GAME STATE ---
const state = {}; 
const clientRooms = {}; 

function makeId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function createAsteroid() {
    return {
        x: Math.random() * 800,
        y: Math.random() * 600,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 2 + 1,
        radius: Math.random() * 20 + 20
    };
}

function initGame() {
    const asteroids = [];
    for (let i = 0; i < 5; i++) asteroids.push(createAsteroid());
    return {
        players: {},
        bullets: [],
        asteroids: asteroids,
        timer: 120, // 2 Minutes
        isOver: false,
        active: false 
    };
}

io.on('connection', (socket) => {

    // 1. CREATE GAME
    socket.on('createGame', (name) => {
        const roomCode = makeId(5);
        clientRooms[socket.id] = roomCode;
        state[roomCode] = initGame();

        socket.join(roomCode);
        // Player ko 5 Lives (lives) di gayi hain
        state[roomCode].players[socket.id] = {
            x: 200, y: 300, angle: 0, score: 0, name: name || "Player 1", lives: 5, eliminated: false
        };

        socket.emit('gameCode', roomCode);
        socket.emit('init', 1);
    });

    // 2. JOIN GAME
    socket.on('joinGame', ({ code, name }) => {
        const room = io.sockets.adapter.rooms.get(code);
        
        if (!room || room.size === 0 || !state[code]) {
            socket.emit('unknownCode');
            return;
        }
        if (room.size >= 2) {
            socket.emit('tooManyPlayers');
            return;
        }

        clientRooms[socket.id] = code;
        socket.join(code);

        state[code].players[socket.id] = {
            x: 600, y: 300, angle: Math.PI, score: 0, name: name || "Player 2", lives: 5, eliminated: false
        };
        
        state[code].active = true; 

        socket.emit('gameCode', code);
        socket.emit('init', 2);
    });

    // 3. INPUT HANDLING
    socket.on('input', (inputs) => {
        const roomCode = clientRooms[socket.id];
        if (!roomCode || !state[roomCode]) return;
        
        const gameState = state[roomCode];
        if (!gameState.active || gameState.isOver) return;

        const p = gameState.players[socket.id];
        // Agar player eliminated hai (5 lives khatam), to wo move nahi kar sakta
        if (p && !p.eliminated) {
            if (inputs.left) p.angle -= 0.1;
            if (inputs.right) p.angle += 0.1;
            if (inputs.up) {
                p.x += Math.cos(p.angle) * 5;
                p.y += Math.sin(p.angle) * 5;
            }
        }
    });

    socket.on('shoot', () => {
        const roomCode = clientRooms[socket.id];
        if (!roomCode || !state[roomCode]) return;
        const gameState = state[roomCode];
        if (!gameState.active || gameState.isOver) return;

        const p = gameState.players[socket.id];
        // Agar zinda hai tabhi goli chalegi
        if (p && !p.eliminated) {
            // LOGIC: Bullet chalane par -2 Score penalty
            p.score -= 2;

            gameState.bullets.push({
                x: p.x, y: p.y, angle: p.angle, speed: 10, ownerId: socket.id, life: 60
            });
        }
    });

    // 4. RESTART GAME
    socket.on('requestRestart', () => {
        const roomCode = clientRooms[socket.id];
        if (!roomCode || !state[roomCode]) return;
        const gameState = state[roomCode];

        if (gameState.isOver) {
            gameState.isOver = false;
            gameState.active = true; 
            gameState.timer = 120;
            gameState.bullets = [];
            gameState.asteroids = [];
            for (let i = 0; i < 5; i++) gameState.asteroids.push(createAsteroid());

            const positions = [
                { x: 200, y: 300, angle: 0 },
                { x: 600, y: 300, angle: Math.PI }
            ];
            let idx = 0;
            for (const id in gameState.players) {
                const p = gameState.players[id];
                p.score = 0;
                p.lives = 5;      // Reset Lives
                p.eliminated = false; // Reset Status
                if (positions[idx]) {
                    p.x = positions[idx].x;
                    p.y = positions[idx].y;
                    p.angle = positions[idx].angle;
                }
                idx++;
            }
            io.to(roomCode).emit('gameRestarted');
        }
    });

    socket.on('disconnect', () => {
        const roomCode = clientRooms[socket.id];
        if (state[roomCode]) {
             delete state[roomCode].players[socket.id];
             state[roomCode].active = false;
             if (Object.keys(state[roomCode].players).length === 0) {
                 delete state[roomCode];
             }
        }
        delete clientRooms[socket.id];
    });
});

// --- GAME LOOP ---
setInterval(() => {
    for (const roomCode in state) {
        const gameState = state[roomCode];
        
        if (!gameState.active || gameState.isOver) {
            io.to(roomCode).emit('gameState', gameState);
            continue;
        }

        // --- WINNING LOGIC CHECK (Advanced) ---
        const playerIds = Object.keys(gameState.players);
        if (playerIds.length === 2) {
            const p1 = gameState.players[playerIds[0]];
            const p2 = gameState.players[playerIds[1]];

            // Scenario 1: Koi ek eliminate ho gaya hai
            if (p1.eliminated || p2.eliminated) {
                let winner = null;

                // Agar P1 mar gaya
                if (p1.eliminated) {
                    if (p2.score > p1.score) winner = p2.name; // P2 ka score jyada hai -> P2 Wins Instantly
                    // Agar P2 ka score kam hai, to game chalta rahega jab tak Timer hai ya P2 overtake na karle
                }
                // Agar P2 mar gaya
                else if (p2.eliminated) {
                    if (p1.score > p2.score) winner = p1.name; // P1 Wins Instantly
                }

                if (winner) {
                    gameState.isOver = true;
                    io.to(roomCode).emit('gameOver', winner);
                    continue; // Skip rest of loop
                }
            }
        }

        // Timer Logic
        gameState.timer -= 1/60;
        if (gameState.timer <= 0) {
            gameState.isOver = true;
            gameState.timer = 0;
            
            // Time khatam hone par score check
            let winnerName = "Draw";
            let players = Object.values(gameState.players);
            if (players.length > 0) {
                players.sort((a, b) => b.score - a.score);
                // Agar scores barabar hain, to Draw, nahi to jiska jyada hai wo jeeta
                if (players[0].score > (players[1]?.score || -9999)) {
                    winnerName = players[0].name;
                }
            }
            io.to(roomCode).emit('gameOver', winnerName);
        }

        const { players, bullets, asteroids } = gameState;

        // Asteroids Move
        asteroids.forEach(a => {
            a.x += Math.cos(a.angle) * a.speed;
            a.y += Math.sin(a.angle) * a.speed;
            if (a.x > 850) a.x = -50; if (a.x < -50) a.x = 850;
            if (a.y > 650) a.y = -50; if (a.y < -50) a.y = 650;
        });

        // Bullets Logic
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.x += Math.cos(b.angle) * b.speed;
            b.y += Math.sin(b.angle) * b.speed;
            b.life--;

            let hit = false;
            
            // Bullet vs Asteroid (+10 Score)
            for (let j = asteroids.length - 1; j >= 0; j--) {
                const a = asteroids[j];
                if (Math.hypot(b.x - a.x, b.y - a.y) < a.radius) {
                    if (players[b.ownerId]) players[b.ownerId].score += 10;
                    asteroids.splice(j, 1);
                    asteroids.push(createAsteroid());
                    hit = true; break;
                }
            }

            // Bullet vs Player (+50 Score)
            if (!hit) {
                for (const pid in players) {
                    if (b.ownerId !== pid) {
                        const p = players[pid];
                        if (!p.eliminated && Math.hypot(b.x - p.x, b.y - p.y) < 20) {
                            players[b.ownerId].score += 50;
                            p.x = Math.random() * 800;
                            p.y = Math.random() * 600;
                            hit = true; break;
                        }
                    }
                }
            }

            if (hit || b.life <= 0) bullets.splice(i, 1);
        }

        // Player vs Asteroid Collision (-20 Score, -1 Life)
        for (const id in players) {
            const p = players[id];
            if (p.eliminated) continue; // Mra hua player nahi takrayega

            for (const a of asteroids) {
                const dist = Math.hypot(p.x - a.x, p.y - a.y);
                if (dist < a.radius + 15) {
                    // LOGIC: Score -20 aur Life -1
                    p.score -= 20;
                    p.lives -= 1;
                    
                    // Respawn
                    p.x = Math.random() * 800;
                    p.y = Math.random() * 600;

                    // Check Death
                    if (p.lives <= 0) {
                        p.lives = 0;
                        p.eliminated = true; // Player game se bahar
                        // Use screen ke bahar fek do taaki dikhe nahi ya alag color kar do
                        p.x = -9999; 
                    }
                }
            }
        }

        io.to(roomCode).emit('gameState', gameState);
    }
}, 1000 / 60);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});