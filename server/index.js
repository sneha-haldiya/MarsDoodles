const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
app.use(cors());

const server = http.createServer(app);

const Rooms = [];
class Room {
    constructor(host, roomname, playerCount, timer) {
        this.roomname = roomname;
        this.Players = [];
        this.Players.push(host);
        this.playerCount = playerCount;
        this.timer = timer;
    }
    addPlayer(player) {
        this.Players.push(player)
        console.log(this.Players);
    }
    getPlayers() {
        return this.Players;
    }
    getHost() {
        return this.host;
    }
    getRoomName() {
        return this.roomname;
    }
    getPlayerCount() {
        return this.playerCount;
    }
    getTimer() {
        return this.timer;
    }
}

class Player {
    constructor(playerName, isHost, isLead, roomName, socketId) {
        this.playerName = playerName
        this.socketId = socketId
        this.isHost = isHost
        this.isLead = isLead
        this.roomName = roomName
        this.points = 0
    }
    getPlayerName() {
        return this.playerName;
    }
    getPlayerSocketId() {
        return this.socketId;
    }
    getPoints() {
        return this.points;
    }
    getIsHost() {
        return this.isHost;
    }
    getIsLead() {
        return this.isLead;
    }
    getRoomName() {
        return this.roomName;
    }
}

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {

    socket.on("join_room", ({ playerName, roomName }) => {
        console.log(Rooms)
        console.log(roomName)
        let roomFound = false;
        let playerFound = false;
        let roomIndex = -1;
        for (let i = 0; i < Rooms.length; i++) {
            if (parseInt(Rooms[i].getRoomName()) == parseInt(roomName)) {
                roomIndex = i;
                roomFound = true;
                console.log(Rooms[i].getPlayers())
                Rooms[i].getPlayers().forEach((player) => {
                    if (player.getPlayerName().toString() === playerName.toString())
                        playerFound = true;
                })
            }
        }
        if (!roomFound) {
            socket.emit("join_unsuccessful", ("Room does not exist!"));
        }
        else if (playerFound) {
            socket.emit("join_unsuccessful", ("A player of same name exits in the room!"));
        }
        /* if (Rooms.map(room => room.getRoomName()).indexOf(roomName.toString()) == -1) {
            socket.emit("join_unsuccessful", ("Room does not exist!"));
        } */
        /* else if ((Rooms[Rooms.map(room => room.roomname).indexOf(roomName)].getPlayers()).some(player => player.getPlayerName()) === playerName)
        {
            socket.emit("join_unsuccessful", ("A player of same name exits in the room!"));
        } */
        else {
            const player = new Player(playerName, false, false, roomName, socket.id);
            Rooms[roomIndex].addPlayer(player);
            socket.join(roomName);
            socket.emit("join_successfull", ({ roomName, playerName }));
        }
    })

    socket.on("create_room", ({ playerName, playerCount, playTime }) => {
        console.log({ playerName, playerCount, playTime } + " create room init(server)")
        let roomName;
        while (roomName == undefined || Rooms.map(room => room.roomname).indexOf(roomName) != -1) {
            roomName = Math.floor(Math.random() * 100000);
        }
        roomName = roomName.toString();
        const p = new Player(playerName, true, true, roomName, socket.id);
        Rooms.push(new Room(p, roomName, playerCount, playTime));
        socket.join(roomName);
        console.log("join successful called (server)" + roomName);
        socket.emit("join_successfull", ({ roomName, playerName }));
    })

    socket.on("send_message", (data) => {
        const p = Rooms[Rooms.map(Room => Room.getRoomName()).indexOf(data.room)].getPlayers();
        p.forEach((player) => {
            if (player.getPlayerName() !== data.author) {
                io.to(player.getPlayerSocketId()).emit('receive_message', (data));
            }
        })
        // io.to(data.room).emit('receive_message', (data));
    });
})

server.listen(3001, () => {
    console.log("Server Connected");
})

