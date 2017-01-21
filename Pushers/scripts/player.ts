import Lib = require('./gameLib');
import Input = require('./input');

export class Player {
    Input: Input.Input;
    Account: string;
    SocketId: string;
    // game variables
    public BaseIncome = 50;
    TurnEnded: boolean; 
    Money: number;
    Dealers: number;
    Muscle: number;
    Snitches: number;
    Operations: number;
    endTurnCallback: Function;

    constructor(loginInfo: string, socketId: string) {
        this.Account = loginInfo;
        this.SocketId = socketId;

        this.TurnEnded = false;
        this.Money = 0;
        this.Dealers = 0;
        this.Muscle = 0;
        this.Snitches = 0;
        this.Operations = 0;
    }

    endTurn() {
        if (this.endTurnCallback) this.endTurnCallback(this);
    }

    setupInput(phase: Lib.TurnPhase) {
        if (this.Input) this.Input.clear();
        this.Input = new Input.Input();
    }
}