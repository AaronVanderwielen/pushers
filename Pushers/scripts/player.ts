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

    constructor(loginInfo: string, socket: SocketIO.Socket) {
        this.Account = loginInfo;
        this.Socket = socket;

        this.TurnEnded = false;
        this.Money = 0;
        this.Dealers = 0;
        this.Muscle = 0;
        this.Snitches = 0;
        this.Operations = 0;
    }

    initGameInstance(game: Game.GameInstance) {
        this.GameInstance = game;
        this.s = new Lib.SocketListeners(game.Id);
    }

    clearAllSocketListeners() {
        this.Socket.removeAllListeners();
    }

    setupPhase() {
        var self = this;

        self.clearAllSocketListeners();

        if (self.GameInstance.TurnPhase == Lib.TurnPhase.Main) {
            self.Socket.on(self.s.ServerAction, function (action: Game.ServerAction) {
                self.mainPhaseAction(action);
            });
            self.Socket.emit(self.s.BeginMainPhase);
        }

        self.Socket.on(self.s.RequestGameData, function () {
            self.Socket.emit(self.s.SendGameData, self.GameInstance.toPlayerData(self.Account));
        });
    }

    mainPhaseAction(action: Game.ServerAction) {
        var self = this;

        if (action.Type == Game.ServerActionType.EndTurn) {
            self.TurnEnded = true;
            self.Socket.emit(self.s.ActionProcessed, true);

            if (self.GameInstance.allPlayerTurnsEnded()) {
                self.GameInstance.startAttackPhase();
            }
        }
    }
}