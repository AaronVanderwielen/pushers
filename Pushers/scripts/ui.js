define(["require", "exports", './gameServer'], function (require, exports, Game) {
    "use strict";
    var Ui = (function () {
        function Ui() {
            this.WaitForServer = false;
        }
        Ui.prototype.asOptions = function (header, array) {
            var message = header + "\n";
            for (var a in array) {
                message += "(" + a + ") " + array[a].MenuLabel + '\n';
            }
            return message;
        };
        Ui.prototype.runMenu = function (title, options) {
            var message = this.asOptions(title, options);
            var input = prompt(message), selection = options[input];
            if (selection) {
                selection.Callback();
            }
            else {
                this.runMenu(title, options);
            }
        };
        Ui.prototype.chooseStartingCity = function (cityNames, callback) {
            var options = [];
            for (var c in cityNames) {
                options.push(new MenuOption(cityNames[c], callback));
            }
            this.runMenu('Choose a city: ', options);
        };
        Ui.prototype.setGameInstance = function (client, game, onServerAction) {
            this.PlayerGameData = game;
            this.OnServerAction = onServerAction.bind(client);
        };
        Ui.prototype.gameMenu = function () {
            var self = this, options = [
                new MenuOption('Resume', self.mainPhaseMenu.bind(self)),
                new MenuOption('Quit', window.close)
            ];
            this.runMenu('Main Menu', options);
        };
        // allow players to set up routes, plan moves, attacks, change prices, hire, start operations, end turn
        Ui.prototype.mainPhaseMenu = function () {
            var self = this, header = 'Turn: ' + self.PlayerGameData.Turn + '\n', options = [
                new MenuOption('City Management', self.citySelectionMenu.bind(self)),
                new MenuOption('Manage Supply Routes', self.supplyRouteMenu.bind(self)),
                new MenuOption('End Turn', self.endTurn.bind(self))
            ];
            this.runMenu(header + 'Choose Action: ', options);
        };
        Ui.prototype.endTurn = function () {
            var endTurnAction = new Game.ServerAction(Game.ServerActionType.EndTurn);
            this.OnServerAction(endTurnAction, function (success) {
                // waiting for players to end turn
            });
        };
        Ui.prototype.citySelectionMenu = function () {
            var self = this, options = [];
            for (var c in self.PlayerGameData.Cities) {
                var city = self.PlayerGameData.Cities[c];
                options.push(new MenuOption(city.Name, self.cityManagementMenu.bind(self, city)));
            }
            options.push(new MenuOption("Back", self.mainPhaseMenu.bind(self)));
            this.runMenu('Choose City: ', options);
        };
        Ui.prototype.cityManagementMenu = function (city) {
            var self = this, header = JSON.stringify(city, null, '\t'), options = [];
            options.push(new MenuOption("Back", self.mainPhaseMenu.bind(self)));
            this.runMenu(header, options);
        };
        Ui.prototype.supplyRouteMenu = function () {
            var self = this, options = [];
            options.push(new MenuOption("Back", self.mainPhaseMenu.bind(self)));
            this.runMenu('Choose Route Or Create New: ', options);
        };
        return Ui;
    }());
    exports.Ui = Ui;
    var MenuOption = (function () {
        function MenuOption(label, callback) {
            this.MenuLabel = label;
            this.Callback = callback;
        }
        return MenuOption;
    }());
});
//# sourceMappingURL=ui.js.map