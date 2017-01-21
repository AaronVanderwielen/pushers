export enum GamePhase {
    Starting,
    Playing,
    End
}

export enum TurnPhase {
    Roll,
    Main,
    Attack
}

export class SocketListeners {
    public static LoginInfo = 'loginInfo';
    public static RequestLoginInfo = 'requestLoginInfo';
    public ChooseStart;
    public StartChosen;
    public StartGame;

    constructor(gameId) {
        this.ChooseStart = 'chooseStart-' + gameId;
        this.StartChosen = 'startChosen-' + gameId;
        this.StartGame = 'startGame-' + gameId;
    }
}