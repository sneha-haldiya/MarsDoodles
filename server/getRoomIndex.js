export const getRoomIndex = (Rooms, roomname) => {
    return Rooms.map(room => room.getRoomName()).indexOf(roomname);
}

