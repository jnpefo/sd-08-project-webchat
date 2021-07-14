const moment = require('moment');
const connection = require('../models/connection');

let objNicks = {};

const data = moment().format('DD-MM-YYYY hh:mm:ss A');

const chatDb = (nickname, chatMessage) => {
  connection().then((db) => db.collection('messages')
    .insertOne({ message: chatMessage, nickname, timestamp: data }));
};

const historyChat = async () => {
  const result = connection().then((db) => db.collection('messages')
    .find({ }).toArray());
  return result;
};

const newMessage = async (chatMessage, nickname, io) => {
  const message = `${data} - ${nickname}: ${chatMessage}`;
  await chatDb(nickname, chatMessage);
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
  io.on('connection', async (socket) => {
    const { id } = socket;
    const nick = id.substring(0, 16);

    objNicks = { [id]: nick, ...objNicks };

    socket.emit('welcome', id, objNicks, await historyChat());

    socket.broadcast.emit('allUser', objNicks);

    socket.on('message', ({ chatMessage, nickname }) => newMessage(chatMessage, nickname, io));

    socket.on('user', (user) => addUser(user, io, id));

    socket.on('disconnect', () => deletUser(id, io));
  });
};
