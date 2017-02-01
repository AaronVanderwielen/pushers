define(["require", "exports", 'underscore'], function (require, exports, _) {
    "use strict";
    var City = (function () {
        function City(name, size) {
            this.Name = name;
            this.Size = size;
            this.Neighbors = [];
        }
        City.prototype.addNeighbor = function (city) {
            if (!_.any(this.Neighbors, function (s) { return s == city.Name; })) {
                this.Neighbors.push(city.Name);
                city.addNeighbor(this);
            }
            return this;
        };
        return City;
    }());
    exports.City = City;
    var PlayerCityData = (function () {
        function PlayerCityData() {
        }
        return PlayerCityData;
    }());
    exports.PlayerCityData = PlayerCityData;
    (function (Size) {
        Size[Size["Small"] = 0] = "Small";
        Size[Size["Medium"] = 1] = "Medium";
        Size[Size["Large"] = 2] = "Large";
    })(exports.Size || (exports.Size = {}));
    var Size = exports.Size;
});
//# sourceMappingURL=city.js.map