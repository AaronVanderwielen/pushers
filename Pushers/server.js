var http = require('http'),
    express = require('express'),
    path = require('path'),
    socket = require("socket.io"),
    requirejs = require('requirejs');

// configure requirejs
requirejs.config({
    nodeRequire: require
});

requirejs(['underscore', './scripts/gameServer'],
    function (_, GameServer) {
        var port = process.env.port || 1337,
            app = express(),
            server = http.Server(app),
            io = socket(server),
            gameServer = new GameServer.ServerInstance(io);

        // socket io
        io.on("connection", function (socket) {
            console.log("socket connection " + socket.id);

            socket.on('disconnect', function () {
                console.log("socket disconnect");
                gameServer.disconnection(socket);
            });

            // find or start session
            gameServer.connection(socket);
        });

        // routing
        app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
        app.get('/', function (req, res) {
            res.sendFile(__dirname + '/default.html');
        });

        // start server
        server.listen(port);
        console.log("Express listening on 1337");
    });