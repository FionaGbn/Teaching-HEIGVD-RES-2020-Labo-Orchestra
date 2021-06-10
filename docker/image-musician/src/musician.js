const protocol = require('./musician-protocol');
const dgram = require('dgram');
const socket = dgram.createSocket('udp4');
const {v4} = require('uuid');
const id = v4();

/*
 * Musician class sending a sound based on the instrument every second
 */
function Musician(instrument) {

    this.instrument = instrument;

    Musician.prototype.update = function() {

        // Create a sound object and serialize it to a JSON strinfg
        const sound = {
            sound: sounds[this.instrument],
            id: id
        };
        const payload = JSON.stringify(sound);

        // Encapsulate the paylod in a UDP datagram and send it on the multicast address
        let message = new Buffer.from(payload);
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function (err, bytes) {
            console.log("Sending payload: " + payload + " via port " + socket.address().port);
        });
    }

    setInterval(this.update.bind(this), 1000);
}

// Get the musician properties from the command line attribute
const instrument = process.argv[2];

const sounds = {
    piano : "ti-ta-ti",
    trumpet : "pouet",
    flute : "trulu",
    violin : "gzi-gzi",
    drum : "boum-boum"
}

const musician = new Musician(instrument);
