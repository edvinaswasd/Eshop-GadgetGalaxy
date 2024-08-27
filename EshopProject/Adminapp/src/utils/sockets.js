const io = require('socket.io-client');
const baseURL =process.env.REACT_APP_BE_URL;

const socket = io.connect(baseURL,{
    transports:['websocket']
})

export default socket;
