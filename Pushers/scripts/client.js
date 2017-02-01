define(["require", "exports", './gameLib', './ui'], function (require, exports, Lib, Ui) {
    "use strict";
    var Client = (function () {
        function Client(io) {
            var self = this;
            self.Ui = new Ui.Ui();
            self.Socket = io.connect('http://localhost:1337');
            self.Socket.on(Lib.SocketListeners.RequestLoginInfo, function (gameId) {
                var info = prompt('Enter Username');
                self.Socket.on(Lib.SocketListeners.Authenticated, function (gameId) {
                    self.s = new Lib.SocketListeners(gameId);
                    self.Socket.on(self.s.ChooseStart, function (cityNames) {
                        self.chooseStart(cityNames);
                    });
                    self.Socket.emit(self.s.ClientReady);
                });
                self.Socket.emit(Lib.SocketListeners.LoginInfo, info);
            });
        }
        Client.prototype.clearAllSocketListeners = function () {
            this.Socket.removeAllListeners();
        };
        Client.prototype.chooseStart = function (cityNames) {
            var self = this;
            self.clearAllSocketListeners();
            self.Socket.on(self.s.BeginMainPhase, function () {
                self.mainPhase();
            });
            self.Ui.chooseStartingCity(cityNames, function (cityName) {
                self.Socket.emit(self.s.StartChosen, cityName);
            });
        };
        Client.prototype.mainPhase = function () {
            var self = this;
            self.Socket.on(self.s.SendGameData, function (gameJson) {
                var game = JSON.parse(gameJson);
                self.Ui.setGameInstance(self, game, self.onServerAction);
                self.Ui.mainPhaseMenu();
            });
            self.Socket.emit(self.s.RequestGameData);
        };
        Client.prototype.onServerAction = function (action, callback) {
            var self = this;
            self.Ui.WaitForServer = true;
            self.Socket.on(self.s.ActionProcessed, function (success) {
                self.Ui.WaitForServer = false;
                callback(success);
            });
            self.Socket.emit(self.s.ServerAction, action);
        };
        ;
        return Client;
    }());
    exports.Client = Client;
});
//# sourceMappingURL=client.js.map