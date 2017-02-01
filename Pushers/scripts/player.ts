import Lib = require('./gameLib');
import Game = require('./gameServer');
import City = require('./city');

export class Player {
    Account: string;
    Socket: SocketIO.Socket;
    GameInstance: Game.GameInstance;
    s: Lib.SocketListeners;
    // game variables
    public BaseIncome = 50;
    TurnEnded: boolean;
    Money: number;
    Dealers: number;
    Muscle: number;
    Snitches: number;
    Operations: number;
    MyCities: City.PlayerCityData[];
    Events: City.CityEvent[];

    constructor(loginInfo: string, socket: SocketIO.Socket) {
        this.Account = loginInfo;
        this.Socket = socket;

        this.TurnEnded = false;
        this.Money = 0;
        this.Dealers = 0;
        this.Muscle = 0;
        this.Snitches = 0;
        this.Operations = 0;
        this.Events = [];
    }

    initGameInstance(game: Game.GameInstance) {
        this.GameInstance = game;
        this.s = new Lib.SocketListeners(game.Id);
    }

    endTurn() {
        var self = this;
        self.TurnEnded = true;

        if (self.GameInstance.allPlayerTurnsEnded()) {
            if (self.GameInstance.TurnPhase == Lib.TurnPhase.Roll) {
                self.GameInstance.startPhase(Lib.TurnPhase.Main);
            }
            else if (self.GameInstance.TurnPhase == Lib.TurnPhase.Main) {
                self.GameInstance.startPhase(Lib.TurnPhase.Attack);
            }
            else if (self.GameInstance.TurnPhase == Lib.TurnPhase.Attack) {
                self.GameInstance.startPhase(Lib.TurnPhase.Roll);
            }
        }
    }

    setupPhase() {
        var self = this;

        self.Socket.on(self.s.RequestGameData, function () {
            self.Socket.emit(self.s.SendGameData, self.GameInstance.toPlayerData(self.Account));
        });

        if (self.GameInstance.TurnPhase == Lib.TurnPhase.Roll) {
            // set up read confirmation listener
            self.Socket.on(self.s.ReadAllEvents, function () {
                self.endTurn();
            });

            // for each city they reside in, risk and reward roll
            for (var c in self.MyCities) {
                var playerCity = self.MyCities[c];
                playerCity.Control++;

                var event = playerCity.tryForEvent();
                if (event) {
                    self.Events.push(event)
                }
            }

            // send event messages
            self.Socket.emit(self.s.SendEvents, JSON.stringify(self.Events));
        }
        else if (self.GameInstance.TurnPhase == Lib.TurnPhase.Main) {
            // allow players to set up routes, plan moves, attacks, change prices, hire, start operations

            self.Socket.on(self.s.ServerAction, function (action: Game.ServerAction) {
                self.mainPhaseAction(action);
            });
            self.Socket.emit(self.s.BeginMainPhase);
        }
        else if (self.GameInstance.TurnPhase == Lib.TurnPhase.Attack) {
        }
    }

    mainPhaseAction(action: Game.ServerAction) {
        var self = this;

        if (action.Type == Game.ServerActionType.EndTurn) {
            self.Socket.emit(self.s.ActionProcessed, true);
            self.endTurn();
        }
    }
}