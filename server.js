// Faça seu código aqui
const express = require('express');
require('dotenv').config();
// const connection

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const cors = require('cors');

const port = process.env.PORT || 3000;

const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/chat.html'));
});

require('./sockets/chat')(io);

http.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
