import express from "express";
const app = express();

import http from "http";
import { Server } from "socket.io";

import cors from "cors";
app.use(cors());

const server = http.createServer(app);

import { getRoomIndex } from './getRoomIndex.js'

import { generate } from "random-words"

import generateBlanks from "./blanks.js";

import getDate from "./getDate.js";

import Filter from "bad-words";
const filter = new Filter();

import formatMessage from "./formatMessage.js";

let word = "";
let blanks = "";
let startGame = false;



const Rooms = [];
class Room {
    constructor(host, lead, roomname, playerCount, timer) {
        this.roomname = roomname;
        this.Players = [];
        this.Players.push(host);
        this.host = host;
        this.lead = lead;
        this.playerCount = playerCount;
        this.timer = timer;
    }
    addPlayer(player) {
        this.Players.push(player)
    }
    removePlayer(playerId) {
        const index = this.Players.map(player => player.getPlayerSocketId()).indexOf(playerId);
        const player = this.Players[index];
        this.Players.splice(index, 1);
        return player.getPlayerName();
    }
    getPlayer(playerId)
    {
        return this.Players.map(player => player.getPlayerSocketId() === playerId);
    }
    getPlayers() {
        return this.Players;
    }
    getHost() {
        return this.host;
    }
    changeHost() {
        /* TODO */
    }
    getLead() {
        return this.lead;
    }
    changeLead() {
        /* TODO */
    }
    getRoomName() {
        return this.roomname;
    }
    getPlayerCountLimit() {
        return this.playerCount;
    }
    getPlayerCount() {
        return this.Players.length;
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
        this.points = 0;
        this.warning = 0;
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
    setWarning(count) {
        this.warning = count;
    }
    getWarning() {
        return this.warning;
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
        let roomFound = false;
        let playerFound = false;
        let roomIndex = -1;
        for (let i = 0; i < Rooms.length; i++) {
            if (parseInt(Rooms[i].getRoomName()) == parseInt(roomName)) {
                roomIndex = i;
                roomFound = true;
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
        else if (Rooms[roomIndex].getPlayerCountLimit() - Rooms[roomIndex].getPlayerCount() <= 0) {
            socket.emit("join_unsuccessful", ("Room you want to join is Full!"));
        }
        else {
            const player = new Player(playerName, false, false, roomName, socket.id);
            Rooms[roomIndex].addPlayer(player);
            socket.join(roomName);
            socket.emit("join_successfull", ({ roomName, playerName, host: false, lead: false }));
            const l = Rooms[roomIndex].getPlayers();
            io.to(roomName).emit("update", (l));
            const message = formatMessage('GameBot', `Welcome to Mars Doodles, ${playerName}`, getDate());
            io.to(roomName).emit('receive_message', (message));
            const playTime = Rooms[roomIndex].getTimer();
            const outTime = Math.floor(playTime / 60) + ":" + playTime % 60;
            socket.emit("set_time_init", ({time: outTime}));
            if(!startGame)
            socket.emit("display_word", (blanks));
        }

    })

    socket.on("create_room", ({ playerName, playerCount, playTime }) => {
        let roomName;
        while (roomName == undefined || /* Rooms.map(room => room.roomname).indexOf(roomName) */ getRoomIndex(Rooms, roomName) != -1) {
            roomName = Math.floor(Math.random() * 100000);
        }
        roomName = roomName.toString();
        const p = new Player(playerName, true, true, roomName, socket.id);
        Rooms.push(new Room(p, p, roomName, playerCount, playTime));
        socket.join(roomName);
        socket.emit("join_successfull", ({ roomName, playerName, host: true, lead: true }));
        const l = [p];
        socket.emit("update", (l));
        const message = formatMessage('GameBot', `Welcome to Mars Doodles, ${playerName}`, getDate());
        io.to(roomName).emit('receive_message', (message));
        const outTime = Math.floor(playTime / 60) + ":" + playTime % 60;
        socket.emit("set_time_init", ({time: outTime}));
    })

    socket.on("send_message", (data) => {
        const p = Rooms[/* Rooms.map(Room => Room.getRoomName()).indexOf(data.room) */getRoomIndex(Rooms, data.room)].getPlayers();
        p.forEach((player) => {
            if (data.mess === word) {
                const message = formatMessage('GameBot', (player.getPlayerName() !== data.author) ? `YAY, ${data.author} guessed the answer!` : `YAY, You guessed the answer!`, getDate());
                io.to(player.getPlayerSocketId()).emit('receive_message', (message));
            }
            else {
                const cleanedMessage = formatMessage(data.author, filter.clean(data.mess), getDate());
                io.to(player.getPlayerSocketId()).emit('receive_message', (cleanedMessage));
                if (cleanedMessage.mess != data.mess) {
                    //console.log(player.getWarning(),"warning");
                    if (player.getPlayerSocketId() === socket.id) {
                        if (player.getWarning() == 0) {
                            io.to(player.getPlayerSocketId()).emit('receive_message', formatMessage('GameBot', `⚠️Warning ${player.getWarning() + 1}: DO NOT USE SUCH LANGUAGE OTHERWISE YOU WILL BE PENALISED!!`, getDate()));
                            player.setWarning(player.getWarning() + 1);
                        }
                        else if (player.getWarning() == 1) {
                            io.to(player.getPlayerSocketId()).emit('receive_message', formatMessage('GameBot', `⚠️Warning ${player.getWarning() + 1}: 50 POINTS DEDUCTED. NEXT TIME YOU WILL BE KICKED OUT!!`, getDate()));
                            player.setWarning(player.getWarning() + 1);
                        }
                        else {
                            socket.leave();
                        }
                    }
                }
            }
        })
        // io.to(data.room).emit('receive_message', (data));
    });

    socket.on("start_game", ({ roomNumber }) => {
        socket.emit("toggle_start_button");
        startGame = true;
        word = generate({ minLength: 4, maxLength: 10 });
        blanks = generateBlanks(word);
        const room = Rooms/* .find(Room => Room.getRoomName() === roomNumber) */[getRoomIndex(Rooms, roomNumber)];
        if (room) {
            const players = room.getPlayers();
            players.forEach(player => {
                if (player.getIsLead()) {
                    //console.log("randomWord~~",randomWord)
                    socket.emit("display_word", (word));
                }
                else {
                    //console.log("blanks~~",blanks);
                    socket.broadcast.to(roomNumber).emit("display_word", (blanks));
                }
            });
            let timer = parseInt(room.getTimer());
            const intervalId = setInterval(() => {
                
                if (timer > 0) {
                    console.log(timer);
                    timer--;
                    const outTime = Math.floor(timer / 60) + ":" + timer % 60;
                    io.to(roomNumber).emit("update_timer", ({updatedTimer: outTime}));
                } else {
                    clearInterval(intervalId);
                    endGame(room.getTimer());
                }
            }, 1000);
        }
    });
    const endGame = (time) => {
        startGame = false;
        const outTime = Math.floor(time / 60) + ":" + time % 60;
        socket.emit("set_time_init", ({time: outTime}));
        word = "";
        blanks = "";
        socket.emit("display_word", (word));
        socket.emit("toggle_start_button");
    }

    const verifyLead = (roomname, socketId) => {
        return Rooms[/* Rooms.map((room) => room.getRoomName()).indexOf(roomname) */getRoomIndex(roomname)].getLead().getPlayerSocketId() === socketId;
    }


    socket.on("set_color", ({ color, roomNumber }) => {
        if (verifyLead(roomNumber, socket.id))
            io.to(roomNumber).emit("set_color_client", ({ penColor: color }));
    })

    socket.on("send_data", ({ image, roomNumber }) => {
        socket.broadcast.to(roomNumber).emit("receive_image", ({ image }));
    })

    socket.on("set_size", ({ size, roomNumber }) => {
        if (verifyLead(roomNumber, socket.id))
            io.to(roomNumber).emit("set_size_client", ({ brushSize: size }));
    })

    socket.on("set_mode", ({ mode, roomNumber }) => {
        if (verifyLead(roomNumber, socket.id))
            io.to(roomNumber).emit("set_mode_client", ({ brushMode: mode }));
    })

    socket.on("request_disconnect", ({ roomNumber }) => {
        const index = getRoomIndex(Rooms, roomNumber);
        const playerName = Rooms[index].removePlayer(socket.id);
        const l = Rooms[index].getPlayers();
        socket.broadcast.to(roomNumber).emit("update", (l));
        const message = formatMessage('GameBot', `${playerName} has left the room.`, getDate());
        io.to(roomNumber).emit('receive_message', (message));
        socket.emit("disconnect_granted");
    })

    socket.on("disconnect", (data) => {
        console.log(data, "has disconnected");
    })
})

server.listen(3001, () => {
    console.log("Server Connected");
}) 

//deal with disconnection