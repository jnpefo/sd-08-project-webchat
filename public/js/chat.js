const socket = window.io();
let getNick;

const formMessage = document.querySelector('#message');
const formUser = document.querySelector('#user');
const inputMessage = document.querySelector('#messageInput');
const inputUser = document.querySelector('#nickName');

const createUser = (user) => {
  const messagesUl = document.querySelector('#users');
  const li = document.createElement('li');
  li.innerText = user;
  li.setAttribute('data-testid', 'online-user');
  messagesUl.appendChild(li);
};

formUser.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('message', inputUser.value);
  inputMessage.value = '';
  return false;
});

socket.on('welcome', (nick) => {
  getNick = nick;
  createUser(getNick);
});

formMessage.addEventListener('submit', (e) => {
  e.preventDefault();
  const obj = {
    chatMessage: inputMessage.value,
    nickname: getNick,
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
