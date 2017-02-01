define(["require", "exports", "underscore", './gameLib', './player', './city'], function (require, exports, _, Lib, Player, City) {
    "use strict";
    var ServerInstance = (function () {
        function ServerInstance(io) {
            this.io = io;
        }
        ServerInstance.prototype.connection = function (socket) {
            var self = this;
            socket.on(Lib.SocketListeners.LoginInfo, function (info) {
                var game = self.findGame(info), player = self.login(info, socket, game);
                if (player) {
                    player.Socket.on(game.s.ClientReady, function () {
                        if (game.GamePhase == null) {
                            game.startGame();
                        }
                    });
                    player.Socket.emit(Lib.SocketListeners.Authenticated, game.Id);
                }
            });
            socket.emit(Lib.SocketListeners.RequestLoginInfo);
        };
        ServerInstance.prototype.disconnection = function (socket) {
            var self = this;
            // set timer to logout after x time
        };
        ServerInstance.prototype.findGame = function (loginInfo) {
            // find an existing game
            var game = _.find(this.games, function (g) {
                return _.any(g.Players, function (p) {
                    return p.Account == loginInfo;
                });
            });
            if (game) {
                return game;
            }
            else {
                // no existing game they are a part of, create new game
                return new GameInstance(this.io);
            }
        };
        ServerInstance.prototype.login = function (loginInfo, socket, game) {
            // check if player exists in this game
            var player = _.find(game.Players, function (p) {
                return p.Account == loginInfo;
            });
            if (player) {
                // they are in this game, reset socketid
                player.Socket = socket;
                return player;
            }
            else {
                // not part of game, add player
                var player = new Player.Player(loginInfo, socket);
                game.addPlayer(player);
                return player;
            }
        };
        return ServerInstance;
    }());
    exports.ServerInstance = ServerInstance;
    var GameInstance = (function () {
        function GameInstance(io) {
            this.io = io;
            this.Id = '1234-123456-123456-1234-1234';
            this.Cities = [];
            this.Players = [];
            this.s = new Lib.SocketListeners(this.Id);
            this.setupCities();
            this.Turn = 0;
        }
        GameInstance.prototype.toPlayerData = function (account) {
            var playerData = new PlayerGameData(this, account);
            return JSON.stringify(playerData);
        };
        GameInstance.prototype.setupCities = function () {
            var bellingham = new City.City("Bellingham", City.Size.Medium), ellensburg = new City.City("Ellensburg", City.Size.Small), everett = new City.City("Everett", City.Size.Medium), kitsap = new City.City("Kitsap", City.Size.Small), mountVernon = new City.City("Mount Vernon", City.Size.Small), olympia = new City.City("Olympia", City.Size.Medium), seattle = new City.City("Seattle", City.Size.Large), spokane = new City.City("Spokane", City.Size.Medium), tacoma = new City.City("Tacoma", City.Size.Large), triCities = new City.City("Tri-Cities", City.Size.Medium), wenatchee = new City.City("Wenatchee", City.Size.Small), yakima = new City.City("Yakima", City.Size.Medium);
            bellingham.addNeighbor(mountVernon);
            mountVernon.addNeighbor(everett);
            everett.addNeighbor(seattle);
            everett.addNeighbor(wenatchee);
            seattle.addNeighbor(tacoma);
            seattle.addNeighbor(ellensburg);
            tacoma.addNeighbor(kitsap);
            tacoma.addNeighbor(olympia);
            olympia.addNeighbor(kitsap);
            wenatchee.addNeighbor(spokane);
            wenatchee.addNeighbor(ellensburg);
            ellensburg.addNeighbor(spokane);
            ellensburg.addNeighbor(yakima);
            yakima.addNeighbor(triCities);
            triCities.addNeighbor(spokane);
            this.Cities.push(bellingham);
            this.Cities.push(ellensburg);
            this.Cities.push(everett);
            this.Cities.push(kitsap);
            this.Cities.push(mountVernon);
            this.Cities.push(olympia);
            this.Cities.push(seattle);
            this.Cities.push(spokane);
            this.Cities.push(tacoma);
            this.Cities.push(triCities);
            this.Cities.push(wenatchee);
            this.Cities.push(yakima);
        };
        GameInstance.prototype.addPlayer = function (player) {
            var self = this;
            player.Money = 200;
            player.initGameInstance(self);
            self.Players.push(player);
        };
        GameInstance.prototype.allPlayerTurnsEnded = function () {
            return _.all(this.Players, function (p) {
                return p.TurnEnded;
            });
        };
        GameInstance.prototype.clearAllSocketListeners = function () {
            for (var p in this.Players) {
                var socket = this.Players[p].Socket;
                socket.removeAllListeners();
            }
        };
        GameInstance.prototype.getSocket = function (id) {
            var socket = this.io.server.sockets.connected[id];
            return socket;
        };
        GameInstance.prototype.startGame = function () {
            var self = this;
            this.GamePhase = Lib.GamePhase.Starting;
            // let players choose starting positions
            var playersChosenStarting = 0, cityNames = _.map(self.Cities, function (c) { return c.Name; });
            for (var p in this.Players) {
                this.Players[p].Socket.once(this.s.StartChosen, function (cityName) {
                    playersChosenStarting++;
                    if (playersChosenStarting == self.Players.length) {
                        self.GamePhase = Lib.GamePhase.Playing;
                        self.startRollPhase();
                    }
                });
                this.Players[p].Socket.emit(this.s.ChooseStart, cityNames);
            }
        };
        GameInstance.prototype.startRollPhase = function () {
            var self = this;
            self.clearAllSocketListeners();
            this.TurnPhase = Lib.TurnPhase.Roll;
            this.Turn++;
            for (var p in this.Players) {
                this.Players[p].setupPhase();
            }
            self.startMainPhase();
        };
        GameInstance.prototype.startMainPhase = function () {
            var self = this;
            self.clearAllSocketListeners();
            self.TurnPhase = Lib.TurnPhase.Main;
            for (var p in self.Players) {
                // allow players to set up routes, plan moves, attacks, change prices, hire, start operations
                self.Players[p].setupPhase();
            }
        };
        GameInstance.prototype.startAttackPhase = function () {
            var self = this;
            self.clearAllSocketListeners();
            this.TurnPhase = Lib.TurnPhase.Attack;
            for (var p in this.Players) {
                this.Players[p].setupPhase();
            }
            // if any attacks queued, simulate them
            self.startRollPhase();
        };
        return GameInstance;
    }());
    exports.GameInstance = GameInstance;
    var PlayerGameData = (function () {
        function PlayerGameData(game, playerId) {
            this.Player = _.find(game.Players, function (p) {
                return p.Account == playerId;
            });
            this.Cities = game.Cities;
            this.Turn = game.Turn;
        }
        return PlayerGameData;
    }());
    exports.PlayerGameData = PlayerGameData;
    var ClientAction = (function () {
        function ClientAction(menuLabel, callback) {
            this.MenuLabel = menuLabel;
            this.Callback = callback;
        }
        return ClientAction;
    }());
    exports.ClientAction = ClientAction;
    var ServerAction = (function () {
        function ServerAction(type) {
            this.Type = type;
        }
        return ServerAction;
    }());
    exports.ServerAction = ServerAction;
    (function (ServerActionType) {
        ServerActionType[ServerActionType["EndTurn"] = 0] = "EndTurn";
    })(exports.ServerActionType || (exports.ServerActionType = {}));
    var ServerActionType = exports.ServerActionType;
});
//# sourceMappingURL=gameServer.js.map