import City = require('./city');
import Game = require('./gameServer');

export class Ui {
    WaitForServer: boolean;
    PlayerGameData: Game.PlayerGameData;
    OnServerAction: (action: Game.ServerAction, callback: (success: boolean) => void) => void;

    constructor() {
        this.WaitForServer = false;
    }

    asOptions(header: string, array: Array<MenuOption>) {
        var message = header + "\n";
        for (var a in array) {
            message += "(" + a + ") " + array[a].MenuLabel + '\n';
        }
        return message;
    }

    runMenu(title: string, options: Array<MenuOption>) {
        var message = this.asOptions(title, options);
        var input = prompt(message),
            selection: MenuOption = options[input];

        if (selection) {
            selection.Callback();
        }
        else {
            this.runMenu(title, options);
        }
    }

    chooseStartingCity(cityNames: string[], callback: Function) {
        var options: MenuOption[] = [];
        for (var c in cityNames) {
            options.push(new MenuOption(cityNames[c], callback));
        }
        this.runMenu('Choose a city: ', options);
    }

    setGameInstance(client, game: Game.PlayerGameData, onServerAction: (action: Game.ServerAction, callback: (success: boolean) => void) => void) {
        this.PlayerGameData = game;
        this.OnServerAction = onServerAction.bind(client);
    }

    // allow players to set up routes, plan moves, attacks, change prices, hire, start operations, end turn
    mainPhaseMenu() {
        var self = this,
            header = 'Turn: ' + self.PlayerGameData.Turn + '\n',
            options: MenuOption[] = [
                new MenuOption('City Management', self.citySelectionMenu.bind(self)),
                new MenuOption('Manage Supply Routes', self.supplyRouteMenu.bind(self)),
                new MenuOption('End Turn', self.endTurn.bind(self))
            ],
            labelGetter = function (val: MenuOption) { return val.MenuLabel; };

        this.runMenu(header + 'Choose Action: ', options);
    }

    endTurn() {
        var endTurnAction = new Game.ServerAction(Game.ServerActionType.EndTurn);
        this.OnServerAction(endTurnAction, function (success: boolean) {
            // waiting for players to end turn
        });
    }

    citySelectionMenu() {
        var self = this,
            options: MenuOption[] = [];

        for (var c in self.PlayerGameData.Cities) {
            var city = self.PlayerGameData.Cities[c];
            options.push(new MenuOption(city.Name, self.cityManagementMenu.bind(self, city)));
        }

        options.push(new MenuOption("Back", self.mainPhaseMenu.bind(self)));

        this.runMenu('Choose City: ', options);
    }

    cityManagementMenu(city: City.City) {
        var self = this,
            header = JSON.stringify(city, null, '\t'),
            options: MenuOption[] = [];

        options.push(new MenuOption("Back", self.mainPhaseMenu.bind(self)));

        this.runMenu(header, options);
    }

    supplyRouteMenu() {
        var self = this,
            options: MenuOption[] = [];

        options.push(new MenuOption("Back", self.mainPhaseMenu.bind(self)));
        this.runMenu('Choose Route Or Create New: ', options);
    }
}

class MenuOption {
    MenuLabel: string;
    Action: Game.IAction;
    Callback: Function;

    constructor(label: string, callback: Function) {
        this.MenuLabel = label;
        this.Callback = callback;
    }
}