import City = require('./city');

export class Ui {

    constructor() {
    }

    chooseStartingCity(cities: City.City[], callback: Function) {
        var rtn,
            message = 'Choose a city: \n';

        for (var c in cities) {
            message += "(" + c + ")" + cities[c].Name + '\n';
        }

        var cityNumber = prompt(message);
        if (cities[cityNumber]) {
            rtn = cities[cityNumber];
        }
        else {
            rtn = this.chooseStartingCity(cities, callback);
        }

        return rtn;
    }
}