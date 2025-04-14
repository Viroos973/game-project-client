import {io} from 'socket.io-client';

const options = {
    transports : ["websocket"],
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout : 10000
}

const socket = io('http://localhost:3001', options);

export default socket;