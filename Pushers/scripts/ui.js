"use strict";
var Ui = (function () {
    function Ui() {
    }
    Ui.prototype.chooseStartingCity = function (cities, callback) {
        var rtn, message = 'Choose a city: \n';
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
    };
    return Ui;
}());
exports.Ui = Ui;
//# sourceMappingURL=ui.js.map