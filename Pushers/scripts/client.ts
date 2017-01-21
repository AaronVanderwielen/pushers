import Lib = require('./gameLib');
import Game = require('./gameServer');
import City = require('./city');
import Input = require('./input');
import Ui = require('./ui');

class Client {
    Socket: SocketIO.Socket;
    Input: Input.Input;
    Ui: Ui.Ui;
    s: Lib.SocketListeners;

    constructor(io) {
        var self = this;

        self.Input = new Input.Input();
        self.Ui = new Ui.Ui();

        self.Socket = io.connect('http://localhost:1337');

        self.Socket.on(Lib.SocketListeners.RequestLoginInfo, function (gameId) {
            self.s = new Lib.SocketListeners(gameId);
            var info = prompt('Enter Username');

            self.Socket.on(self.s.ChooseStart, function (game: Game.GameInstance) {
                self.chooseStart(game.Cities);
            });

            self.Socket.emit(Lib.SocketListeners.LoginInfo, info);
        });
    }

    clearAllSocketListeners() {
        this.Socket.removeAllListeners();
    }

    chooseStart(cities: City.City[]) {
        var self = this;
        self.clearAllSocketListeners();

        self.Socket.on(self.s.StartGame, function () {
        });

        self.Ui.chooseStartingCity(cities, function (city: City.City) {
            self.Socket.emit(self.s.StartChosen, city);
        });
    }
}