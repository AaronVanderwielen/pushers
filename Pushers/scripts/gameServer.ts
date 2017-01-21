import _ = require("underscore");
import Lib = require('./gameLib');
import Player = require('./player');
import City = require('./city');

export class ServerInstance {
    io;
    games: GameInstance[];

    constructor(io) {
        this.io = io;
    }

    connection(socket: SocketIO.Socket) {
        var self = this;

        socket.on(Lib.SocketListeners.LoginInfo, function (info: string) {
            var game: GameInstance = self.findGame(info),
                player: Player.Player = self.login(info, socket.id, game);

            if (player) {
                var gameState = game.getState();
                gameState['Player'] = player;

                if (gameState.GamePhase == null) {
                    game.startGame();
                }
            }
        });

        socket.emit(Lib.SocketListeners.RequestLoginInfo);
    }

    disconnection(socket: SocketIO.Socket) {
        var self = this;

        // set timer to logout after x time
    }

    findGame(loginInfo: string) {
        // find an existing game
        var game = _.find(this.games, function (g: GameInstance) {
            return _.any(g.Players, function (p: Player.Player) {
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
    }

    login(loginInfo: string, socketId: string, game: GameInstance) {
        // check if player exists in this game
        var player: Player.Player = _.find(game.Players, function (p: Player.Player) {
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
    }
}

export class GameInstance {
    io;
    Id: string;
    s: Lib.SocketListeners;
    Cities: City.City[];
    Players: Player.Player[];
    GamePhase: Lib.GamePhase;
    TurnPhase: Lib.TurnPhase;
    Turn: number;

    constructor(io) {
        this.io = io;
        this.Id = '1234-123456-123456-1234-1234';
        this.Cities = [];
        this.Players = [];

        this.s = new Lib.SocketListeners(this.Id);
        this.setupCities();
        this.Turn = 0;
    }

    setupCities() {
        var bellingham = new City.City("Bellingham", City.Size.Medium),
            ellensburg = new City.City("Ellensburg", City.Size.Small),
            everett = new City.City("Everett", City.Size.Medium),
            kitsap = new City.City("Kitsap", City.Size.Small),
            mountVernon = new City.City("Mount Vernon", City.Size.Small),
            olympia = new City.City("Olympia", City.Size.Medium),
            seattle = new City.City("Seattle", City.Size.Large),
            spokane = new City.City("Spokane", City.Size.Medium),
            tacoma = new City.City("Tacoma", City.Size.Large),
            triCities = new City.City("Tri-Cities", City.Size.Medium),
            wenatchee = new City.City("Wenatchee", City.Size.Small),
            yakima = new City.City("Yakima", City.Size.Medium);

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
    }

    addPlayer(player: Player.Player) {
        var self = this;

        player.Money = 200;
        player.endTurnCallback = this.playerEndTurn;

        this.Players.push(player);
    }

    playerEndTurn(player: Player.Player) {
        if (this.GamePhase == Lib.GamePhase.Playing) {
            if (_.all(this.Players, function (p: Player.Player) { return p.TurnEnded; })) {
                if (this.TurnPhase == Lib.TurnPhase.Roll) this.startMainPhase();
                if (this.TurnPhase == Lib.TurnPhase.Main) this.startAttackPhase();
                if (this.TurnPhase == Lib.TurnPhase.Attack) this.startRollPhase();
            }
        }
    }

    startGame() {
        var self = this;
        this.GamePhase = Lib.GamePhase.Starting;

        // let players choose starting positions
        var playersChosenStarting = 0,
            cityNames = _.map(self.Cities, function (c: City.City) { return c.Name; });

        for (var p in this.Players) {
            var socket = self.getSocket(this.Players[p].SocketId);

            socket.once(this.s.StartChosen, function (cityName: string) {
                playersChosenStarting++;

                if (playersChosenStarting == self.Players.length) {
                    self.GamePhase = Lib.GamePhase.Playing;
                    self.startRollPhase();
                }
            });

            socket.emit(this.s.ChooseStart, cityNames);
        }
    }

    clearAllSocketListeners() {
        for (var p in this.Players) {
            var socket = this.getSocket(this.Players[p].SocketId);
            socket.removeAllListeners();
        }
    }

    getSocket(id: string) {
        var socket: SocketIO.Socket = this.io.server.sockets.connected[id];
        return socket;
    }

    startRollPhase() {
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
    }

    startMainPhase() {
        var self = this;
        self.clearAllSocketListeners();

        this.TurnPhase = Lib.TurnPhase.Main;

        for (var p in this.Players) {
            this.Players[p].setupInput(this.TurnPhase);
        }

        // allow players to set up routes, plan moves, attacks, change prices, hire, start operations

        //self.startAttackPhase();
    }

    startAttackPhase() {
        var self = this;
        self.clearAllSocketListeners();

        this.TurnPhase = Lib.TurnPhase.Attack;

        for (var p in this.Players) {
            this.Players[p].setupInput(this.TurnPhase);
        }

        // if any attacks queued, simulate them

        //self.startRollPhase();
    }

    getState() {
        return {
            GamePhase: this.TurnPhase,
            TurnPhase: this.TurnPhase
        }
    }
}