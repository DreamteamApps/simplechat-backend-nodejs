var inquirer = require("inquirer");
var ui = new inquirer.ui.BottomBar();

var socket = require("socket.io-client");

var baseUrl = "http://127.0.0.1:3334";
var socketClient;
var user;
var room;

const startChatOrChangeUrlScreen = () => {
  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'answer',
      message: 'Start client or change url?',
      choices: [
        `Start chat (${baseUrl})`,
        'Change url',
      ]
    },
  ]).then((response) => {
    switch (response.answer) {
      case "Change url": {
        changeUrlScreen();
        break;
      }
      case `Start chat (${baseUrl})`: {
        nameScreen();
        break;
      }
    }
  });
};

const changeUrlScreen = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: 'Type url: ',
    },
  ]).then((response) => {

    if (!response.answer) {
      changeUrlScreen();
      return;
    }

    baseUrl = response.answer;

    startChatOrChangeUrlScreen();
  });
}

const nameScreen = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: 'Type username: ',
    },
  ]).then(async (response) => {
    if (!response.answer) {
      nameScreen();
    }

    socketClient = socket(baseUrl);
    socketClient.emit("join-room", {
      userId: 2
    });

    socketClient.on('user-joined', (data) => {
      console.log(`${data.username} has joined the room!`);
    });
  
    socketClient.on('user-leaved', (data) => {
      console.log(`${data.username} has leaved.`);
    });
  
    socketClient.on('user-writing-message', (data) => {
      console.log(`${data.username} is typing...`);
    });

    socketClient.on('user-send-message', (data) => {
      console.log(`${data.user.username}: ${data.message}.`);
    });

    chatScreen();
  });
}

const chatScreen = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: 'Message: ',
    },
  ]).then(async (response) => {
    socketClient.emit("writing-message");

    if (!response.answer) {
      chatScreen();
    }

    socketClient.emit("send-message", {
      message: response.answer,
      type: 'text'
    });

    chatScreen();
  });
};

(() => {
  startChatOrChangeUrlScreen();
})();
