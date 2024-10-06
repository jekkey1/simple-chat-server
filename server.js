const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');

// Инициализация приложения Express
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Функция для получения локального IP-адреса
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const localIP = getLocalIP();

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

// Запуск сервера
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://${localIP}:${PORT}`);
});