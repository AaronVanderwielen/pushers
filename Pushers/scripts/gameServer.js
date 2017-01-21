"use strict";
var _ = require("underscore");
var Lib = require('./gameLib');
var Player = require('./player');
var City = require('./city');
var ServerInstance = (function () {
    function ServerInstance(io) {
        this.io = io;
    }
    ServerInstance.prototype.connection = function (socket) {
        var self = this;
        socket.on(Lib.SocketListeners.LoginInfo, function (info) {
            var game = self.findGame(info), player = self.login(info, socket.id, game);
            if (player) {
                var gameState = game.getState();
                gameState['Player'] = player;
                if (gameState.GamePhase == null) {
                    game.startGame();
                }
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
    ServerInstance.prototype.login = function (loginInfo, socketId, game) {
        // check if player exists in this game
        var player = _.find(game.Players, function (p) {
            return p.Account == loginInfo;
        });
        if (player) {
            // they are in this game, reset socketid
            player.SocketId = socketId;
            return player;
        }
        else {
            // not part of game, add player
            var player = new Player.Player(loginInfo, socketId);
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
        player.endTurnCallback = this.playerEndTurn;
        this.Players.push(player);
    };
    GameInstance.prototype.playerEndTurn = function (player) {
        if (this.GamePhase == Lib.GamePhase.Playing) {
            if (_.all(this.Players, function (p) { return p.TurnEnded; })) {
                if (this.TurnPhase == Lib.TurnPhase.Roll)
                    this.startMainPhase();
                if (this.TurnPhase == Lib.TurnPhase.Main)
                    this.startAttackPhase();
                if (this.TurnPhase == Lib.TurnPhase.Attack)
                    this.startRollPhase();
            }
        }
    };
    GameInstance.prototype.startGame = function () {
        var self = this;
        this.GamePhase = Lib.GamePhase.Starting;
        // let players choose starting positions
        var playersChosenStarting = 0, cityNames = _.map(self.Cities, function (c) { return c.Name; });
        for (var p in this.Players) {
            var socket = self.getSocket(this.Players[p].SocketId);
            socket.once(this.s.StartChosen, function (cityName) {
                playersChosenStarting++;
                if (playersChosenStarting == self.Players.length) {
                    self.GamePhase = Lib.GamePhase.Playing;
                    self.startRollPhase();
                }
            });
            socket.emit(this.s.ChooseStart, cityNames);
        }
    };
    GameInstance.prototype.clearAllSocketListeners = function () {
        for (var p in this.Players) {
            var socket = this.getSocket(this.Players[p].SocketId);
            socket.removeAllListeners();
        }
    };
    GameInstance.prototype.getSocket = function (id) {
        var socket = this.io.server.sockets.connected[id];
        return socket;
    };
    GameInstance.prototype.startRollPhase = function () {
        var self = this;
        self.clearAllSocketListeners();
        this.TurnPhase = Lib.TurnPhase.Roll;
        this.Turn++;
        for (var p in this.Players) {
            this.Players[p].setupInput(this.TurnPhase);
        }
        // risk roll for each city
        // on success risk, roll for severity
        // reward roll for each city
        // on success reward, roll for severity
        // if reward + risk, choose one, 50-50
        // translate risk/reward to event, apply
        //self.startMainPhase();
    };
    GameInstance.prototype.startMainPhase = function () {
        var self = this;
        self.clearAllSocketListeners();
        this.TurnPhase = Lib.TurnPhase.Main;
        for (var p in this.Players) {
            this.Players[p].setupInput(this.TurnPhase);
        }
        // allow players to set up routes, plan moves, attacks, change prices, hire, start operations
        //self.startAttackPhase();
    };
    GameInstance.prototype.startAttackPhase = function () {
        var self = this;
        self.clearAllSocketListeners();
        this.TurnPhase = Lib.TurnPhase.Attack;
        for (var p in this.Players) {
            this.Players[p].setupInput(this.TurnPhase);
        }
        // if any attacks queued, simulate them
        //self.startRollPhase();
    };
    GameInstance.prototype.getState = function () {
        return {
            GamePhase: this.TurnPhase,
            TurnPhase: this.TurnPhase
        };
    };
    return GameInstance;
}());
exports.GameInstance = GameInstance;
//# sourceMappingURL=gameServer.js.map