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
    public static Authenticated = 'authenticated';
    public ClientReady;
    public ChooseStart;
    public StartChosen;
    public SendEvents;
    public ReadAllEvents;
    public BeginMainPhase;
    public ServerAction;
    public ActionProcessed;
    public RequestGameData;
    public SendGameData;

    constructor(gameId) {
        this.ClientReady = 'clientReady-' + gameId;
        this.ChooseStart = 'chooseStart-' + gameId;
        this.StartChosen = 'startChosen-' + gameId;
        this.SendEvents = 'sendEvents-' + gameId;
        this.ReadAllEvents = 'readAllEvents-' + gameId;
        this.BeginMainPhase = 'beginMainPhase-' + gameId;
        this.ServerAction = 'mainPhaseAction-' + gameId;
        this.ActionProcessed = 'actionProcessed-' + gameId;
        this.RequestGameData = 'requestGameData-' + gameId;
        this.SendGameData = 'receiveGameData-' + gameId;
    }
}