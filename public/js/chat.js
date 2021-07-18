const socket = window.io();
let idLogado;
const DATA_TESTEID = 'data-testid';

const formMessage = document.querySelector('#message');
const formUser = document.querySelector('#user');
const ulUsers = document.querySelector('#users');
const inputMessage = document.querySelector('#messageInput');
const inputUser = document.querySelector('#nickName');
const pNick = document.querySelector('#nick');

const creatListUser = (users) => {
  const { [idLogado]: nickName, ...userList } = users;
  const arrayUser = Object.values(userList);
  pNick.innerText = nickName;
  ulUsers.innerText = '';
  arrayUser.forEach((value) => {
    const userUl = document.querySelector('#users');
    const li = document.createElement('li');
    li.innerText = value;
    li.setAttribute(DATA_TESTEID, 'online-user');
    li.setAttribute('class', 'list-group-item list-group-item-action d-flex justify-content-center');
    li.setAttribute('id', 'online-user');
    userUl.appendChild(li);
  });
};

formUser.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('user', inputUser.value);
  inputMessage.value = '';
  return false;
});

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const obj = {
    chatMessage: inputMessage.value,
    nickname: pNick.innerText,
  };
  socket.emit('message', obj);
  inputMessage.value = '';
  return false;
});

const createMessage = (message) => {
  const messagesUl = document.querySelector('#messages');
  const li = document.createElement('li');
  li.setAttribute(DATA_TESTEID, 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

const allChat = (historyChat) => {
  const messagesUl = document.querySelector('#messages');
  historyChat.forEach((e) => {
    const { timestamp, nickname, message } = e;
    const li = document.createElement('li');
    li.setAttribute(DATA_TESTEID, 'message');
    li.innerText = `${timestamp} - ${nickname}: ${message}`;
    messagesUl.appendChild(li);
  });
};

socket.on('welcome', (id, nick, historyChat) => {
  idLogado = id;
  creatListUser(nick);
  allChat(historyChat);
});

socket.on('message', (message) => createMessage(message));

socket.on('user', (objNicks) => creatListUser(objNicks));

socket.on('removeUser', (objNicks) => creatListUser(objNicks));

socket.on('allUser', (objNicks) => creatListUser(objNicks));
