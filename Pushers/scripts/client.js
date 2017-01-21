"use strict";
var Lib = require('./gameLib');
var Input = require('./input');
var Ui = require('./ui');
var Client = (function () {
    function Client(io) {
        var self = this;
        self.Input = new Input.Input();
        self.Ui = new Ui.Ui();
        self.Socket = io.connect('http://localhost:1337');
        self.Socket.on(Lib.SocketListeners.RequestLoginInfo, function (gameId) {
            self.s = new Lib.SocketListeners(gameId);
            var info = prompt('Enter Username');
            self.Socket.on(self.s.ChooseStart, function (game) {
                self.chooseStart(game.Cities);
            });
            self.Socket.emit(Lib.SocketListeners.LoginInfo, info);
        });
    }
    Client.prototype.clearAllSocketListeners = function () {
        this.Socket.removeAllListeners();
    };
    Client.prototype.chooseStart = function (cities) {
        var self = this;
        self.clearAllSocketListeners();
        self.Socket.on(self.s.StartGame, function () {
        });
        self.Ui.chooseStartingCity(cities, function (city) {
            self.Socket.emit(self.s.StartChosen, city);
        });
    };
    return Client;
}());
//# sourceMappingURL=client.js.map