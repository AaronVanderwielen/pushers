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
        function PlayerCityData(name, size) {
            this.Name = name;
            this.Size = size;
            this.Control = 1;
            this.Pushers = 0;
            this.Operations = 0;
        }
        PlayerCityData.prototype.tryForEvent = function () {
            var self = this, rtn, eventOccur = self.rollForEvent();
            if (eventOccur) {
                // on success risk, roll for severity and for good/bad
                var severity = self.rollForSeverity(), positive = Math.random() <= .5, event = self.transformToEvent(severity, positive);
                // check if player has met conditions in this city for this severe of event
                if (self.eventConditionsMet(event.EventType)) {
                    // add event to player's queue
                    rtn = event;
                }
            }
            return rtn;
        };
        PlayerCityData.prototype.rollForEvent = function () {
            // probability for a two dice roll based on city size
            //
            //      2   3   4   5   6   7   8   9   10  11  12
            // S    x                                       x
            // M    x   x                               x   x
            // L    x   x   x                       x   x   x
            var success = false, random = Math.random();
            switch (this.Size) {
                case Size.Small:
                    success = random <= (2 / 36);
                    break;
                case Size.Medium:
                    success = random <= (4 / 36);
                    break;
                case Size.Large:
                    success = random <= (6 / 36);
                    break;
            }
            return success;
        };
        PlayerCityData.prototype.rollForSeverity = function () {
            var severity = 0, random = Math.random();
            if (random <= .40) {
                severity = 1;
            }
            else if (random <= .70) {
                severity = 2;
            }
            else if (random <= .85) {
                severity = 3;
            }
            else if (random <= .92) {
                severity = 4;
            }
            else {
                severity = 5;
            }
            return severity;
        };
        PlayerCityData.prototype.eventConditionsMet = function (event) {
            var self = this, rtn = false;
            switch (event) {
                case CityEventType.MoneyGain:
                case CityEventType.MoneyLoss:
                    rtn = true;
                    break;
                case CityEventType.NewPusher:
                case CityEventType.NewSnitch:
                    if (self.Control > 10)
                        rtn = true;
                    break;
                case CityEventType.SupplierFound:
                case CityEventType.SupplierBust:
                    if (self.Control > 50)
                        rtn = true;
                    break;
                case CityEventType.OperationSuperYield:
                case CityEventType.OperationPoorYield:
                case CityEventType.OperationBust:
                    if (self.Operations > 0)
                        rtn = true;
                    break;
            }
            return rtn;
        };
        PlayerCityData.prototype.transformToEvent = function (severity, positive) {
            var event = new CityEvent(this.Name);
            if (severity == 1) {
                if (positive)
                    event.EventType = CityEventType.MoneyGain;
                else
                    event.EventType = CityEventType.MoneyLoss;
            }
            else if (severity = 2) {
                if (positive)
                    event.EventType = CityEventType.NewPusher;
                else
                    event.EventType = CityEventType.NewSnitch;
            }
            else if (severity = 3) {
                if (positive)
                    event.EventType = CityEventType.SupplierFound;
                else
                    event.EventType = CityEventType.SupplierBust;
            }
            else if (severity = 4) {
                if (positive)
                    event.EventType = CityEventType.OperationSuperYield;
                else
                    event.EventType = CityEventType.OperationPoorYield;
            }
            else if (severity = 5) {
                if (positive)
                    event.EventType = CityEventType.OperationSuperYield;
                else
                    event.EventType = CityEventType.OperationBust;
            }
            return event;
        };
        return PlayerCityData;
    }());
    exports.PlayerCityData = PlayerCityData;
    var CityEvent = (function () {
        function CityEvent(cityName) {
            this.CityName = cityName;
        }
        return CityEvent;
    }());
    exports.CityEvent = CityEvent;
    (function (CityEventType) {
        CityEventType[CityEventType["MoneyGain"] = 0] = "MoneyGain";
        CityEventType[CityEventType["MoneyLoss"] = 1] = "MoneyLoss";
        CityEventType[CityEventType["NewPusher"] = 2] = "NewPusher";
        CityEventType[CityEventType["NewSnitch"] = 3] = "NewSnitch";
        CityEventType[CityEventType["SupplierFound"] = 4] = "SupplierFound";
        CityEventType[CityEventType["SupplierBust"] = 5] = "SupplierBust";
        CityEventType[CityEventType["OperationSuperYield"] = 6] = "OperationSuperYield";
        CityEventType[CityEventType["OperationPoorYield"] = 7] = "OperationPoorYield";
        CityEventType[CityEventType["OperationBust"] = 8] = "OperationBust";
    })(exports.CityEventType || (exports.CityEventType = {}));
    var CityEventType = exports.CityEventType;
    (function (Size) {
        Size[Size["Small"] = 0] = "Small";
        Size[Size["Medium"] = 1] = "Medium";
        Size[Size["Large"] = 2] = "Large";
    })(exports.Size || (exports.Size = {}));
    var Size = exports.Size;
});
//# sourceMappingURL=city.js.map