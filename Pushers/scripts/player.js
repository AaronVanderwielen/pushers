define(["require", "exports", './gameLib', './gameServer'], function (require, exports, Lib, Game) {
    "use strict";
    var Player = (function () {
        function Player(loginInfo, socket) {
            // game variables
            this.BaseIncome = 50;
            this.Account = loginInfo;
            this.Socket = socket;
            this.TurnEnded = false;
            this.Money = 0;
            this.Dealers = 0;
            this.Muscle = 0;
            this.Snitches = 0;
            this.Operations = 0;
        }
        Player.prototype.initGameInstance = function (game) {
            this.GameInstance = game;
            this.s = new Lib.SocketListeners(game.Id);
        };
        Player.prototype.clearAllSocketListeners = function () {
            this.Socket.removeAllListeners();
        };
        Player.prototype.setupPhase = function () {
            var self = this;
            self.clearAllSocketListeners();
            if (self.GameInstance.TurnPhase == Lib.TurnPhase.Main) {
                self.Socket.on(self.s.ServerAction, function (action) {
                    self.mainPhaseAction(action);
                });
                self.Socket.emit(self.s.BeginMainPhase);
            }
            self.Socket.on(self.s.RequestGameData, function () {
                self.Socket.emit(self.s.SendGameData, self.GameInstance.toPlayerData(self.Account));
            });
        };
        Player.prototype.mainPhaseAction = function (action) {
            var self = this;
            if (action.Type == Game.ServerActionType.EndTurn) {
                self.TurnEnded = true;
                self.Socket.emit(self.s.ActionProcessed, true);
                if (self.GameInstance.allPlayerTurnsEnded()) {
                    self.GameInstance.startAttackPhase();
                }
            }
        };
        return Player;
    }());
    exports.Player = Player;
});
//# sourceMappingURL=player.js.map