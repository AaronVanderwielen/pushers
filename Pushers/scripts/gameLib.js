define(["require", "exports"], function (require, exports) {
    "use strict";
    (function (GamePhase) {
        GamePhase[GamePhase["Starting"] = 0] = "Starting";
        GamePhase[GamePhase["Playing"] = 1] = "Playing";
        GamePhase[GamePhase["End"] = 2] = "End";
    })(exports.GamePhase || (exports.GamePhase = {}));
    var GamePhase = exports.GamePhase;
    (function (TurnPhase) {
        TurnPhase[TurnPhase["Roll"] = 0] = "Roll";
        TurnPhase[TurnPhase["Main"] = 1] = "Main";
        TurnPhase[TurnPhase["Attack"] = 2] = "Attack";
    })(exports.TurnPhase || (exports.TurnPhase = {}));
    var TurnPhase = exports.TurnPhase;
    var SocketListeners = (function () {
        function SocketListeners(gameId) {
            this.ClientReady = 'clientReady-' + gameId;
            this.ChooseStart = 'chooseStart-' + gameId;
            this.StartChosen = 'startChosen-' + gameId;
            this.BeginMainPhase = 'beginMainPhase-' + gameId;
            this.ServerAction = 'mainPhaseAction-' + gameId;
            this.ActionProcessed = 'actionProcessed-' + gameId;
            this.RequestGameData = 'requestGameData-' + gameId;
            this.SendGameData = 'receiveGameData-' + gameId;
        }
        SocketListeners.LoginInfo = 'loginInfo';
        SocketListeners.RequestLoginInfo = 'requestLoginInfo';
        SocketListeners.Authenticated = 'authenticated';
        return SocketListeners;
    }());
    exports.SocketListeners = SocketListeners;
});
//# sourceMappingURL=gameLib.js.map