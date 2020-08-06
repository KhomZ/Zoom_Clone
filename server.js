const express = require('express')
const app = express() //app variable is equal to that running that express function
const server = require('http').Server(app) //pass our actual app object here. This allows us to create a server to be used with socket IO
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs') //this is how we're going to render our views in our case we have downloaded the ejs library
app.use(express.static('public')) //this is going to be public where we can put all of our JavaScript and CSS all in this public folder here

app.get('/', (req, res) => {
    //this is going to take in our request and a response. With that req and res we want create a brand new room and redirect the user to that room because we don't have the homepage for this application. so let's create a route for our room
    res.redirect(`/${uuidV4()}`) //create dynamic room
})

app.get('/:room',(req, res) => {
    // here /:room is a dynamic parameter that we pass into the URL and req and res. and inside of this we can get our room from the parameter above
    res.render('room', { roomId: req.params.room })
})

//before diving into front end let's handle our server with socket
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000) //it's actually going to start up our server on port 3000