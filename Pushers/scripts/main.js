require.config({
    baseUrl: '/js',
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

requirejs(['jquery', 'underscore', 'socketio', 'client', 'manager', 'player', 'ui', 'connect', 'input'],
    function (jquery, underscore, socketio, Client, Manager, Player, Ui, Connect, Input) {
        Client.Client(socketio);
    });