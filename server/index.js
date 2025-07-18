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

import collection from "./mongo.js";

let word = "";
let blanks = "";
let startGame = false;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const Rooms = [];
class Room {
    constructor(host, lead, roomname, playerCount, timer) {
        this.roomname = roomname;
        this.Players = [];
        this.Players.push(host);
        this.host = host;
        this.hostIndex = 0;
        this.leadIndex = 0;
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
    getPlayer(playerId) {
        return this.Players.map(player => player.getPlayerSocketId() === playerId);
    }
    getPlayers() {
        return this.Players;
    }
    getHost() {
        return this.host;
    }
    changeHost() {
        let newIndex = -1;
        if (this.Players.length == 1)
            return;
        else if (this.Players.length == 2)
            newIndex = this.hostIndex == 0 ? 1 : 0;
        else {
            while (newIndex == -1 || newIndex == this.hostIndex) {
                newIndex = Math.floor(Math.random() * 100) % this.Players.length;
            }
        }
        for (let i = 0; i < this.Players.length; i++) {
            if (i === newIndex) {
                this.Players[i].isHost = true;
                io.to(this.Players[i].getPlayerSocketId()).emit("update_host", { host: true });
            }
            else {
                this.Players[i].isHost = false;
                io.to(this.Players[i].getPlayerSocketId()).emit("update_host", { host: false });
            }
        }
        this.host = this.Players[newIndex];
        this.hostIndex = newIndex;
        // console.log(JSON.stringify(Rooms));
        const l = JSON.stringify(this.Players);
        io.to(this.roomname).emit("update", ({l: l}));
        const message = formatMessage('GameBot', `${this.Players[newIndex].getPlayerName()} is the new host!`, getDate());
        io.to(this.roomname).emit('receive_message', (message));
    }
    getLead() {
        return this.lead;
    }
    changeLead() {
        let newIndex = -1;
        if (this.Players.length == 1)
            return;
        else if (this.Players.length == 2)
            newIndex = this.leadIndex == 0 ? 1 : 0;
        else {
            while (newIndex == -1 || newIndex == this.leadIndex) {
                newIndex = Math.floor(Math.random() * 100) % this.Players.length;
            }
        }
        for (let i = 0; i < this.Players.length; i++) {
            if (i === newIndex) {
                this.Players[i].isLead = true;
                io.to(this.Players[i].getPlayerSocketId()).emit("update_lead", { lead: true });
                io.to(this.Players[i].getPlayerSocketId()).emit("toggle_start_button", (true));
            }
            else {
                this.Players[i].isLead = false;
                io.to(this.Players[i].getPlayerSocketId()).emit("update_lead", { lead: false });
                io.to(this.Players[i].getPlayerSocketId()).emit("toggle_start_button", (false));
            }
        }
        this.lead = this.Players[newIndex];
        this.leadIndex = newIndex;
        // console.log(JSON.stringify(Rooms));
        const l = JSON.stringify(this.Players);
        io.to(this.roomname).emit("update", ({l: l}));
        const message = formatMessage('GameBot', `${this.Players[newIndex].getPlayerName()} is the new lead!`, getDate());
        io.to(this.roomname).emit('receive_message', (message));
        
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
        this.gainPoints = 0;
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
    setPoints(p) {
        this.points = p;
    }
    getGainPoints() {
        return this.gainPoints;
    }
    setGainPoints(p) {
        this.gainPoints = p;
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
        origin: "*",
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
            socket.emit("join_successfull", ({ roomName, playerName, host: false, lead: false }));
            const message = formatMessage('GameBot', `Welcome to Mars Doodles, ${playerName}`, getDate());
            socket.join(roomName);
            io.to(roomName).emit('receive_message', (message));
            const playTime = Rooms[roomIndex].getTimer();
            const outTime = Math.floor(playTime / 60) + ":" + playTime % 60;
            socket.emit("set_time_init", ({ time: outTime }));
            if (!startGame)
                socket.emit("display_word", (blanks));
            const l = JSON.stringify(Rooms[roomIndex].getPlayers());
            io.to(roomName).emit("update", ({l}));
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
        socket.emit("join_successfull", ({ roomName, playerName, host: true, lead: true }));
        socket.join(roomName);
        const message = formatMessage('GameBot', `Welcome to Mars Doodles, ${playerName}`, getDate());
        io.to(roomName).emit('receive_message', (message));
        const outTime = Math.floor(playTime / 60) + ":" + playTime % 60;
        socket.emit("set_time_init", ({ time: outTime }));
        const l = JSON.stringify(Rooms[getRoomIndex(Rooms, roomName)].getPlayers());
        socket.emit("update", ({l}));
    })

    socket.on("send_message", (data) => {
        const p = Rooms[/* Rooms.map(Room => Room.getRoomName()).indexOf(data.room) */getRoomIndex(Rooms, data.room)].getPlayers();
        p.forEach((player) => {
            if (data.mess === word) {
                if(player.getPlayerSocketId() === socket.id)
                player.setGainPoints(100);
                const message = formatMessage('GameBot', (player.getPlayerName() !== data.author) ? `YAY, ${data.author} guessed the answer!` : `YAY, You guessed the answer!`, getDate());
                io.to(player.getPlayerSocketId()).emit('receive_message', (message));
            }
            else {
                const cleanedMessage = formatMessage(data.author, filter.clean(data.mess), getDate());
                io.to(player.getPlayerSocketId()).emit('receive_message', (cleanedMessage));
                if (cleanedMessage.mess != data.mess) {
                    if (player.getPlayerSocketId() === socket.id) {
                        if (player.getWarning() == 0) {
                            io.to(player.getPlayerSocketId()).emit('receive_message', formatMessage('GameBot', `⚠️Warning ${player.getWarning() + 1}: DO NOT USE SUCH LANGUAGE OTHERWISE YOU WILL BE PENALISED!!`, getDate()));
                            player.setWarning(player.getWarning() + 1);
                        }
                        else if (player.getWarning() == 1) {
                            player.setGainPoints(player.getGainPoints() - 50);
                            io.to(player.getPlayerSocketId()).emit('receive_message', formatMessage('GameBot', `⚠️Warning ${player.getWarning() + 1}: 50 POINTS DEDUCTED. NEXT TIME YOU WILL BE KICKED OUT!!`, getDate()));
                            player.setWarning(player.getWarning() + 1);
                        }
                        else {
                            socket.emit("force_remove");
                        }
                    }
                }
            }
        })
    });

    socket.on("start_game", ({ roomNumber }) => {
        socket.emit("toggle_start_button", (false));
        socket.emit("disable_chat");
        startGame = true;
        word = generate({ minLength: 4, maxLength: 10 });
        blanks = generateBlanks(word);
        let roomIndex = getRoomIndex(Rooms, roomNumber);
        const room = Rooms[roomIndex];
        if (room) {
            const players = room.getPlayers();
            players.forEach(player => {
                if (player.getIsLead()) {
                    
                    socket.emit("display_word", (word));
                }
                else {
                    
                    socket.broadcast.to(roomNumber).emit("display_word", (blanks));
                }
            });
            let timer = parseInt(room.getTimer());
            const intervalId = setInterval(() => {

                if (timer > 0) {
                    
                    timer--;
                    const outTime = Math.floor(timer / 60) + ":" + timer % 60;
                    io.to(roomNumber).emit("update_timer", ({ updatedTimer: outTime }));
                } else {
                    clearInterval(intervalId);
                    endGame(room.getTimer(), roomIndex);
                }
            }, 1000);
            io.to(roomNumber).emit("clear_canvas");
        }
    });

    socket.on('clear_canvas', ({ roomNumber }) => {
        io.to(roomNumber).emit('clear_canvas');
    });

    const endGame = (time, roomIndex) => {
        startGame = false;
        const outTime = Math.floor(time / 60) + ":" + time % 60;
        const l = Rooms[roomIndex].getPlayers();
        io.to(Rooms[roomIndex].getRoomName()).emit("update_points", (l));
        Rooms[roomIndex].getPlayers().forEach((p) => {p.setPoints(p.getPoints() + p.getGainPoints()); p.setGainPoints(0)})
        io.to(Rooms[roomIndex].getRoomName()).emit("set_time_init", ({ time: outTime }));
        word = "";
        blanks = "";
        io.to(Rooms[roomIndex].getRoomName()).emit("display_word", (word));
        Rooms[roomIndex].changeLead();
    }

    const verifyLead = (roomname, socketId) => {
        return Rooms[getRoomIndex(Rooms, roomname)].getLead().getPlayerSocketId() === socketId;
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

    socket.on("save_image", () => {
        socket.emit("save_image");
    })

    socket.on("kick_player", ({ player }) => {
        io.to(player.socketId).emit("force_remove");
    })

    socket.on("request_disconnect", ({ roomNumber }) => {
        socket.emit("disconnect_granted");
    })

    socket.on("disconnecting", () => {
        const roomNumber = Array.from((socket.rooms).values())[1];
        const socketId = socket.id;
        const index = getRoomIndex(Rooms, roomNumber);
        if(Rooms[index].getHost().getPlayerSocketId() === socketId)
            Rooms[index].changeHost();
        if(Rooms[index].getLead().getPlayerSocketId() === socketId)
            Rooms[index].changeLead();
        const playerName = Rooms[index].removePlayer(socketId);
        const l = JSON.stringify(Rooms[index].getPlayers());
        io.to(roomNumber).emit("update", ({l: l}));
        const message = formatMessage('GameBot', `${playerName} has left the room.`, getDate());
        io.to(roomNumber).emit('receive_message', (message));
    })
    socket.on("disconnect", (data) => {
        console.log(data, "has disconnected");
    })
})

app.get("/", cors(), (req, res) => {
    res.send("Server is up and running");
});

app.post("/", async (req, res) => {
    const { username, password } = req.body;
    try {
        const check = await collection.findOne({username: username}); 
        if (check) {
            if(check.password === password)
            {
                res.json("Login Success");
            }
            else
            {
                res.json("Login Failed: Incorrect Password");
            }
        }
        else {
            res.json("Login Failed: Username Not Found");
        }
    } 
    catch (e) {
        res.json(`Error: ${ e }`);
    }
});

app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    try {
        const check = await collection.findOne({username: username});
        if (check) {
            res.json("Signup Failed: Username Already Exist");
        } else {
            await collection.insertMany([{username: username, password: password}]);
            res.json("Signup Success")
        }
    }
    catch (e) {
        res.json(`Error: ${ e }`);
    }
});

const mongoServer = app.listen(8000, () => {
    console.log("MongoDB Server connected on port 8000");
});

server.listen(3001, () => {
    console.log("Server Connected");
})

//deal with disconnection