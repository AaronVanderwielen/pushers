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
        this.ChooseStart = 'chooseStart-' + gameId;
        this.StartChosen = 'startChosen-' + gameId;
        this.StartGame = 'startGame-' + gameId;
    }
    SocketListeners.LoginInfo = 'loginInfo';
    SocketListeners.RequestLoginInfo = 'requestLoginInfo';
    return SocketListeners;
}());
exports.SocketListeners = SocketListeners;
//# sourceMappingURL=gameLib.js.map