const moment = require('moment');

const data = moment().format('DD-MM-YYYY hh:mm:ss A');
module.exports = (io) => {
  io.on('connection', (socket) => {
    const { id } = socket;
    const nick = id.substring(0, 16);
    socket.emit('welcome', nick);

    socket.on('message', ({ chatMessage, nickname }) => {
      const message = `${data} - ${nickname}: ${chatMessage}`;

      // console.log(message);
      io.emit('message', message);
    });

    socket.broadcast.emit('message', 'Tivemos nova conexão!');
  });
};
