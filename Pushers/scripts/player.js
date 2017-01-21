"use strict";
var Input = require('./input');
var Player = (function () {
    function Player(loginInfo, socketId) {
        // game variables
        this.BaseIncome = 50;
        this.Account = loginInfo;
        this.SocketId = socketId;
        this.TurnEnded = false;
        this.Money = 0;
        this.Dealers = 0;
        this.Muscle = 0;
        this.Snitches = 0;
        this.Operations = 0;
    }
    Player.prototype.endTurn = function () {
        if (this.endTurnCallback)
            this.endTurnCallback(this);
    };
    Player.prototype.setupInput = function (phase) {
        if (this.Input)
            this.Input.clear();
        this.Input = new Input.Input();
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map