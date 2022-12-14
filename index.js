require('dotenv').config()
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = process.env.HOST_PORT;

server.listen(port, () => {
    console.log(`server is listening to port ${port}`)
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/javascript', (req, res) => {
    res.sendFile(__dirname + '/public/javascript.html')
});

app.get('/CSS', (req, res) => {
    res.sendFile(__dirname + '/public/CSS.html')
});

app.get('/endpoint', (req, res) => {
    console.log("you reached endpoint")
    res.send("you reached endpoint")
});


const tech = io.of('/tech');

tech.on('connection', (socket) => {

    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `new user joined ${data.room} room.`);
    })

    socket.on('message', (data) => {
        console.log(`message: ${data.msg}`);
        tech.in(data.room).emit('message', data.msg);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        tech.emit('message', 'user disconnected');
    })
})