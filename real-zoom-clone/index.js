const express = require('express');
const app = express();
const fs = require('fs');
const server1 = require('http').Server(app);
const io = require('socket.io')(server1);
const https = require('https');
const port = 3000;
const { v4: uuidV4 } = require('uuid');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})
app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
        socket.on('disconnect', () => {
            socket.to(roomId).emit('user-disconnected', userId)
        })
    })
});
const httpsOptions = {
    key: fs.readFileSync('./security/key.pem'),
    cert: fs.readFileSync('./security/cert.pem')
}
const server = https.createServer(httpsOptions, app)
    .listen(port , () =>{
        console.log(`the port is: ${port}`);
    });

//peers