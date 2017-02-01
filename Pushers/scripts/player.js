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
            this.Events = [];
        }
        Player.prototype.initGameInstance = function (game) {
            this.GameInstance = game;
            this.s = new Lib.SocketListeners(game.Id);
        };
        Player.prototype.endTurn = function () {
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
        };
        Player.prototype.setupPhase = function () {
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
                        self.Events.push(event);
                    }
                }
                // send event messages
                self.Socket.emit(self.s.SendEvents, JSON.stringify(self.Events));
            }
            else if (self.GameInstance.TurnPhase == Lib.TurnPhase.Main) {
                // allow players to set up routes, plan moves, attacks, change prices, hire, start operations
                self.Socket.on(self.s.ServerAction, function (action) {
                    self.mainPhaseAction(action);
                });
                self.Socket.emit(self.s.BeginMainPhase);
            }
            else if (self.GameInstance.TurnPhase == Lib.TurnPhase.Attack) {
            }
        };
        Player.prototype.mainPhaseAction = function (action) {
            var self = this;
            if (action.Type == Game.ServerActionType.EndTurn) {
                self.Socket.emit(self.s.ActionProcessed, true);
                self.endTurn();
            }
        };
        return Player;
    }());
    exports.Player = Player;
});
//# sourceMappingURL=player.js.map