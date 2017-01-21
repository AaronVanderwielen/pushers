"use strict";
var _ = require('underscore');
var City = (function () {
    function City(name, size) {
        this.Name = name;
        this.Size = size;
        this.Neighbors = [];
    }
    City.prototype.addNeighbor = function (city) {
        if (!_.any(this.Neighbors, function (n) { return n.Name == city.Name; })) {
            this.Neighbors.push(city);
            city.addNeighbor(this);
        }
        return this;
    };
    return City;
}());
exports.City = City;
(function (Size) {
    Size[Size["Small"] = 0] = "Small";
    Size[Size["Medium"] = 1] = "Medium";
    Size[Size["Large"] = 2] = "Large";
})(exports.Size || (exports.Size = {}));
var Size = exports.Size;
//# sourceMappingURL=city.js.map