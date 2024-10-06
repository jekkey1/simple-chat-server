const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Инициализация приложения Express
const app = express();

// Добавляем CORS, чтобы разрешить подключение из мобильных приложений
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Обработка подключений пользователей
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Получаем сообщения от пользователя и пересылаем их всем участникам
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Обработка отключения пользователя
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Запуск сервера на динамическом порту (или 3000 по умолчанию)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
