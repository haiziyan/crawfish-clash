const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const MAP_W = 2400;
const MAP_H = 2400;
const ARENA_R = 1100;

const rooms = {};

function createRoom(roomId) {
  return {
    id: roomId,
    players: {},
    foods: generateFoods(80),
    startTime: Date.now(),
    duration: 300000,
  };
}

function generateFoods(count) {
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * ARENA_R * 0.9;
    return {
      id: `f${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
      x: MAP_W / 2 + Math.cos(angle) * r,
      y: MAP_H / 2 + Math.sin(angle) * r,
      type: Math.random() < 0.1 ? 'spicy' : Math.random() < 0.15 ? 'steam' : 'normal',
    };
  });
}

const httpServer = createServer((req, res) => {
  // 健康检查端点（Render 需要）
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify({
    status: 'ok',
    message: '🦞 小龙虾大战游戏服务器运行中',
    rooms: Object.keys(rooms).length,
    players: Object.values(rooms).reduce((acc, r) => acc + Object.keys(r.players).length, 0),
  }));
});

const io = new Server(httpServer, {
  cors: {
    origin: [
      CLIENT_URL,
      'http://localhost:3000',
      /\.vercel\.app$/,
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Render 免费版需要长轮询降级支持
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
});

io.on('connection', (socket) => {
  console.log(`[连接] ${socket.id} 总连接数: ${io.engine.clientsCount}`);

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

    socket.emit('game_state', {
      player: room.players[socket.id],
      players: Object.values(room.players),
      foods: room.foods,
    });

    socket.to(roomId).emit('player_joined', room.players[socket.id]);
    console.log(`[加入] ${nickname} 进入房间 ${roomId}，当前 ${Object.keys(room.players).length} 人`);
  });

  socket.on('player_move', ({ x, y, angle, size, hp, score }) => {
    const roomId = socket.data.roomId;
    if (!roomId || !rooms[roomId]) return;
    const player = rooms[roomId].players[socket.id];
    if (!player) return;
    player.x = x; player.y = y; player.angle = angle;
    player.size = size; player.hp = hp; player.score = score;
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
        console.log(`[清理] 房间 ${roomId} 已清空`);
      }
    }
    console.log(`[断开] ${socket.id}`);
  });
});

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🦞 小龙虾大战游戏服务器运行在端口 ${PORT}`);
  console.log(`   允许来源: ${CLIENT_URL}`);
});

// 防止 Render 免费版休眠：定期自我 ping
if (process.env.RENDER_EXTERNAL_URL) {
  setInterval(() => {
    const https = require('https');
    https.get(process.env.RENDER_EXTERNAL_URL, () => {}).on('error', () => {});
  }, 14 * 60 * 1000); // 每14分钟 ping 一次
}
