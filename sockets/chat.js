const moment = require('moment');

let objNicks = {};

const data = moment().format('DD-MM-YYYY hh:mm:ss A');
module.exports = (io) => {
  io.on('connection', (socket) => {
    const { id } = socket;
    const nick = id.substring(0, 16);
    objNicks = {
      [id]: nick,
    };
    socket.emit('welcome', id, nick);
    
    socket.on('message', ({ chatMessage, nickname }) => {
      console.log(nickname);
      const message = `${data} - ${nickname}: ${chatMessage}`;
      
      io.emit('message', message);
    });
    
    socket.on('user', (user) => {
      objNicks[id] = user;
      io.emit('user', objNicks);
    });
  });
};
