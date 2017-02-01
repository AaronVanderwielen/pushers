require.config({
    baseUrl: '/scripts',
    shim: {
        jquery: {
            exports: '$'
        },
        underscore: {
            exports: '_'
        },
        socketio: {
            exports: 'io'
        },
        createjs: {
            exports: 'createjs'
        }
    },
    paths: {
        jquery: 'util/jquery.min',
        underscore: 'util/underscore',
        socketio: 'util/socket.io-1.3.5',
        createjs: 'util/createjs-2015.05.21.min'
    }
});

requirejs(['jquery', 'underscore', 'socketio', 'client', 'gameServer', 'player', 'ui'],
    function (jquery, underscore, socketio, Client, GameServer, Player, Ui) {
        var client = new Client.Client(socketio);
    });