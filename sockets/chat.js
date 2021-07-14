const moment = require('moment');

let objNicks = {};

const data = moment().format('DD-MM-YYYY hh:mm:ss A');

const newMessage = (chatMessage, nickname, io) => {
  const message = `${data} - ${nickname}: ${chatMessage}`;
  io.emit('message', message);
};

const addUser = (user, io, id) => {
  objNicks[id] = user;
  io.emit('user', objNicks);
};

const deletUser = (id, io) => {
  delete objNicks[id];
  io.emit('removeUser', objNicks);
};
module.exports = (io) => {
  io.on('connection', (socket) => {
    const { id } = socket;
    const nick = id.substring(0, 16);

    objNicks = { [id]: nick, ...objNicks };

    socket.emit('welcome', id, objNicks);

    socket.broadcast.emit('allUser', objNicks);

    socket.on('message', ({ chatMessage, nickname }) => newMessage(chatMessage, nickname, io));

    socket.on('user', (user) => addUser(user, io, id));

    socket.on('disconnect', () => deletUser(id, io));

  });
};
