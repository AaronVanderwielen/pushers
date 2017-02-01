import Lib = require('./gameLib');
import Game = require('./gameServer');
import City = require('./city');
import Ui = require('./ui');

export class Client {
    Socket: SocketIO.Socket;
    Ui: Ui.Ui;
    s: Lib.SocketListeners;

    constructor(io) {
        var self = this;

        self.Ui = new Ui.Ui();

        self.Socket = io.connect('http://localhost:1337');

        self.Socket.on(Lib.SocketListeners.RequestLoginInfo, function (gameId) {
            var info = prompt('Enter Username');

            self.Socket.on(Lib.SocketListeners.Authenticated, function (gameId: string) {
                self.s = new Lib.SocketListeners(gameId);

                self.Socket.on(self.s.ChooseStart, function (cityNames: string[]) {
                    self.chooseStart(cityNames);
                });

                self.Socket.emit(self.s.ClientReady);
            });

            self.Socket.emit(Lib.SocketListeners.LoginInfo, info);
        });
    }

    clearAllSocketListeners() {
        this.Socket.removeAllListeners();
    }

    chooseStart(cityNames: string[]) {
        var self = this;
        self.clearAllSocketListeners();

        self.Socket.on(self.s.BeginMainPhase, function () {
            self.mainPhase();
        });

        self.Ui.chooseStartingCity(cityNames, function (cityName: string) {
            self.Socket.emit(self.s.StartChosen, cityName);
        });
    }

    mainPhase() {
        var self = this;

        self.Socket.on(self.s.SendGameData, function (gameJson: string) {
            var game: Game.PlayerGameData = JSON.parse(gameJson);
            self.Ui.setGameInstance(self, game, self.onServerAction);
            self.Ui.mainPhaseMenu();
        });

        self.Socket.emit(self.s.RequestGameData);
    }

    onServerAction(action: Game.ServerAction, callback: (success: boolean) => void) {
        var self = this;
        self.Ui.WaitForServer = true;
        self.Socket.on(self.s.ActionProcessed, function (success) {
            self.Ui.WaitForServer = false;
            callback(success);
        });
        self.Socket.emit(self.s.ServerAction, action);
    };
}