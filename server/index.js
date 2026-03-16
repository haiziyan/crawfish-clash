const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const MAP_W = 2400;
const MAP_H = 2400;
const ARENA_R = 1100;

// 游戏状态
const rooms = {};

function createRoom(roomId) {
  return {
    id: roomId,
    players: {},
    foods: generateFoods(80),
    startTime: Date.now(),
    duration: 300000, // 5分钟
  };
}

function generateFoods(count) {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * ARENA_R * 0.9;
    return {
      id: `f${Date.now()}-${i}`,
      x: MAP_W / 2 + Math.cos(angle) * r,
      y: MAP_H / 2 + Math.sin(angle) * r,
      type: Math.random() < 0.1 ? 'spicy' : Math.random() < 0.15 ? 'steam' : 'normal',
    };
  });
}

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', message: '小龙虾大战 游戏服务器运行中' }));
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[连接] ${socket.id}`);

  socket.on('join_room', ({ roomId, nickname, color }) => {
    if (!rooms[roomId]) rooms[roomId] = createRoom(roomId);
    const room = rooms[roomId];

    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * 300;
    room.players[socket.id] = {
      id: socket.id,
      name: nickname || '无名虾',
      x: MAP_W / 2 + Math.cos(angle) * r,
      y: MAP_H / 2 + Math.sin(angle) * r,
      size: 24,
      hp: 100,
      maxHp: 100,
      score: 0,
      color: color || '#E74C3C',
      angle: 0,
    };

    socket.join(roomId);
    socket.data.roomId = roomId;

    // 发送初始状态
    socket.emit('game_state', {
      player: room.players[socket.id],
      players: Object.values(room.players),
      foods: room.foods,
    });

    // 通知房间其他人
    socket.to(roomId).emit('player_joined', room.players[socket.id]);
    console.log(`[加入] ${nickname} 进入房间 ${roomId}，当前 ${Object.keys(room.players).length} 人`);
  });

  socket.on('player_move', ({ x, y, angle, size, hp, score }) => {
    const roomId = socket.data.roomId;
    if (!roomId || !rooms[roomId]) return;
    const player = rooms[roomId].players[socket.id];
    if (!player) return;

    player.x = x;
    player.y = y;
    player.angle = angle;
    player.size = size;
    player.hp = hp;
    player.score = score;

    socket.to(roomId).emit('player_updated', player);
  });

  socket.on('eat_food', ({ foodId }) => {
    const roomId = socket.data.roomId;
    if (!roomId || !rooms[roomId]) return;
    const room = rooms[roomId];
    const idx = room.foods.findIndex(f => f.id === foodId);
    if (idx !== -1) {
      room.foods.splice(idx, 1);
      io.to(roomId).emit('food_eaten', { foodId });
      // 补充食物
      if (room.foods.length < 40) {
        const newFoods = generateFoods(10);
        room.foods.push(...newFoods);
        io.to(roomId).emit('foods_added', newFoods);
      }
    }
  });

  socket.on('player_eliminated', ({ targetId }) => {
    const roomId = socket.data.roomId;
    if (!roomId || !rooms[roomId]) return;
    io.to(roomId).emit('player_died', { id: targetId });
    delete rooms[roomId].players[targetId];
  });

  socket.on('use_skill', ({ skill }) => {
    const roomId = socket.data.roomId;
    if (!roomId) return;
    socket.to(roomId).emit('skill_used', { playerId: socket.id, skill });
  });

  socket.on('disconnect', () => {
    const roomId = socket.data.roomId;
    if (roomId && rooms[roomId]) {
      delete rooms[roomId].players[socket.id];
      io.to(roomId).emit('player_left', { id: socket.id });
      if (Object.keys(rooms[roomId].players).length === 0) {
        delete rooms[roomId];
        console.log(`[房间] ${roomId} 已清空`);
      }
    }
    console.log(`[断开] ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🦞 小龙虾大战游戏服务器运行在 http://localhost:${PORT}`);
});

