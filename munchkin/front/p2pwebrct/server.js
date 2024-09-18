const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const {version, validate} = require('uuid');

const ACTIONS = require('./src/socket/actions');
const PORT = process.env.PORT || 3001;

const clientConnections = {};
let clientIdWaitingMatch = [];

function getClientRooms() {
  const {rooms} = io.sockets.adapter;

  return Array.from(rooms.keys()).filter(roomID => validate(roomID) && version(roomID) === 4);
}

function shareRoomsInfo() {
  io.emit(ACTIONS.SHARE_ROOMS, {
    rooms: getClientRooms()
  })
}
let clientId = {};
let IDclient;
io.on('connection', socket => {
	
	//подключение игрока
  // const clientId = createClientId();
	// console.log("подключился игрок "+ clientId);
  // clientConnections[clientId] = socket;

  socket.on("message", message => {
    let moveData = message;
    moveData.num = clientId[IDclient];
		
		if (moveData.method == "Create"){
			IDclient = moveData.room;
			clientId[IDclient] = 1;
			console.log("подключился игрок "+ clientId[IDclient]);
			clientConnections[clientId[IDclient]] = socket;
			
		}

		if (moveData.method == "Join"){
			IDclient = moveData.room.roomID;
			clientId[IDclient] += 1;
			console.log("подключился игрок "+ clientId[IDclient]);
			clientConnections[clientId[IDclient]] = socket;
			
		}
    // Отправить информацию о перемещении карты другим клиентам
    if (moveData.method == "Start"){
			console.log(clientId[IDclient]);
			matchClients(clientId[IDclient]);
		}
    else if (moveData.method == "StartGame") { 
      io.emit("message", moveData);
    }
		else{
			socket.broadcast.emit("message", moveData);
		}
		
  });

  shareRoomsInfo();

  socket.on(ACTIONS.JOIN, config => {
    const {room: roomID} = config;
    const {rooms: joinedRooms} = socket;

    if (Array.from(joinedRooms).includes(roomID)) {
      return console.warn(`Already joined to ${roomID}`);
    }

    const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

    clients.forEach(clientID => {
      io.to(clientID).emit(ACTIONS.ADD_PEER, {
        peerID: socket.id,
        createOffer: false
      });

      socket.emit(ACTIONS.ADD_PEER, {
        peerID: clientID,
        createOffer: true,
      });
    });

    socket.join(roomID);
    shareRoomsInfo();
  });

  function leaveRoom() {
    const {rooms} = socket;

    Array.from(rooms)
      // LEAVE ONLY CLIENT CREATED ROOM
      .filter(roomID => validate(roomID) && version(roomID) === 4)
      .forEach(roomID => {

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

        clients
          .forEach(clientID => {
          io.to(clientID).emit(ACTIONS.REMOVE_PEER, {
            peerID: socket.id,
          });

          socket.emit(ACTIONS.REMOVE_PEER, {
            peerID: clientID,
          });
        });

        socket.leave(roomID);
      });

    shareRoomsInfo();
  }

  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on('disconnecting', leaveRoom);

  socket.on(ACTIONS.RELAY_SDP, ({peerID, sessionDescription}) => {
    io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerID: socket.id,
      sessionDescription,
    });
  });

  socket.on(ACTIONS.RELAY_ICE, ({peerID, iceCandidate}) => {
    io.to(peerID).emit(ACTIONS.ICE_CANDIDATE, {
      peerID: socket.id,
      iceCandidate,
    });
  });

});

function matchClients(clientId) {

	let coutner = 1;
	while(coutner<=clientId){
		clientIdWaitingMatch.push(coutner);
		coutner+=1;
	};

  if (clientId == 2) {
		
    const firstClientId = clientIdWaitingMatch.shift();
    const secondClientId = clientIdWaitingMatch.shift();
		console.log(`я работаю:${firstClientId}`);
    clientConnections[firstClientId].emit("message", {
      method: "1",
      fl: false,
      num: clientId
    });
    clientConnections[secondClientId].emit("message", {
      method: "2Players",
      fl: true
    });
		console.log("отправлено двум игрокам");
  }
  if (clientId == 3) {
    const firstClientId = clientIdWaitingMatch.shift();
    const secondClientId = clientIdWaitingMatch.shift();
    const thirdClientId = clientIdWaitingMatch.shift();

    clientConnections[firstClientId].emit("message", {
      method: "1",
      fl: false,
      num: clientId
    });
    clientConnections[secondClientId].emit("message", {
      method: "3Players",
      fl: "2player"
    });
    clientConnections[thirdClientId].emit("message", {
      method: "3Players",
      fl: "3player"
    });
		console.log("отправлено трем игрокам");
  }
}


// let clientIdCounter = 0;
// function createClientId() {
//   clientIdCounter++;
//   return clientIdCounter;
// }




//const publicPath = path.join(__dirname, 'build');
//app.use(express.static(publicPath));
const publicPath = path.join(__dirname, 'public');

const mime = require('mime-types'); // Для получения MIME-типов

app.use(express.static(publicPath, {
  setHeaders: (res, path, stat) => {
    res.set('Content-Type', mime.lookup(path));
  }
}));
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(PORT, () => {
	console.log(`Сервер Socket.IO запущен на порту ${PORT}`);
})