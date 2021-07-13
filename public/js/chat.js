const socket = window.io();
let idLogado;
let getNick;

const formMessage = document.querySelector('#message');
const formUser = document.querySelector('#user');
const ulUsers = document.querySelector('#users');
const inputMessage = document.querySelector('#messageInput');
const inputUser = document.querySelector('#nickName');
const pNick = document.querySelector('#nick');

const createUser = (user) => {  
  pNick.innerText = user;
};

const creatListUser = (users) => {
  ulUsers.innerText = '';
  const { [idLogado]: nickName, ...userList } = users;
  const arrayUser = Object.values(userList);
  pNick.innerText = nickName;
  arrayUser.forEach((value) => {
    const userUl = document.querySelector('#users');
    const li = document.createElement('li');
    li.innerText = value;
    li.setAttribute('data-testid', 'online-user');
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

socket.on('welcome', (id, nick) => {
  idLogado = id;
  getNick = nick;
  createUser(nick);
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
  li.setAttribute('data-testid', 'message');
  li.innerText = message;
  messagesUl.appendChild(li);
};

socket.on('message', (message) => createMessage(message));

socket.on('user', (user) => creatListUser(user));
