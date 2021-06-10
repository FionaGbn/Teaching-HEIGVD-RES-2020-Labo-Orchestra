const protocol = require('./auditor-protocol');
const dgram = require('dgram');
const net = require("net");

let musiciansPlaying = new Map();

// After TCP connection send a JSON payload containing the list of active musicians
const tcpServer = net.createServer((socket) => {
    let musicians = [];
    musiciansPlaying.forEach((value, key) => {
        musicians.push({uuid: key, instrument: value.instrument, activeSince: value.activeSince});
    });

    socket.end(Buffer.from(JSON.stringify(musicians, null, 2)));
});

tcpServer.listen(protocol.TCP_PORT);

// Create a datagram socket listening for datagrams published in the multicast group by musicians
const socket = dgram.createSocket('udp4');
socket.bind(protocol.PROTOCOL_PORT, () => {
    console.log("Joining multicast group");
    socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// Callback function invoked when a new datagram has arrived
socket.on('message', (msg, source) => {
    console.log("Data has arrived: " + msg + ". Source port: " + source.port);
    const data = JSON.parse(msg.toString());
    const id = data.id;
    const instrument = instruments[data.sound];

    musiciansPlaying.set(id, {instrument: instrument, activeSince: new Date()})

});

// Check every 5 seconds if musicians are still playing
setInterval(() => {
    musiciansPlaying.forEach(checkMusician);
}, 5000);

function checkMusician(value, key) {
    if (Date.now() - value.activeSince.getTime() > 5000) {
        musiciansPlaying.delete(key);
    }
}

const instruments = {
    'ti-ta-ti' : "piano",
    pouet : "trumpet",
    trulu : "trumpet",
    'gti-gzi' : "violin",
    'boum-boum': "drum"
}
