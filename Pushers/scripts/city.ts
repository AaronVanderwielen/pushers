import _ = require('underscore');

export class City {
    Name: string;
    Size: Size;
    Neighbors: string[];

    constructor(name: string, size: Size) {
        this.Name = name;
        this.Size = size;
        this.Neighbors = [];
    }

    addNeighbor(city: City) {
        if (!_.any(this.Neighbors, function (s: string) { return s == city.Name; })) {
            this.Neighbors.push(city.Name);
            city.addNeighbor(this);
        }

        return this;
    }
}

export class PlayerCityData {
    Name: string;
    Size: Size;
    Control: number;
    Pushers: number;
    Operations: number;

    constructor(name, size) {
        this.Name = name;
        this.Size = size;
        this.Control = 1;
        this.Pushers = 0;
        this.Operations = 0;
    }

    tryForEvent() {
        var self = this,
            rtn,
            eventOccur = self.rollForEvent();

        if (eventOccur) {
            // on success risk, roll for severity and for good/bad
            var severity = self.rollForSeverity(),
                positive = Math.random() <= .5,
                event: CityEvent = self.transformToEvent(severity, positive);

            // check if player has met conditions in this city for this severe of event
            if (self.eventConditionsMet(event.EventType)) {
                // add event to player's queue
                rtn = event;
            }
        }

        return rtn;
    }

    rollForEvent() {
        // probability for a two dice roll based on city size
        //
        //      2   3   4   5   6   7   8   9   10  11  12
        // S    x                                       x
        // M    x   x                               x   x
        // L    x   x   x                       x   x   x

        var success = false,
            random = Math.random();

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
    }

    rollForSeverity() {
        var severity = 0,
            random = Math.random();

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
    }

    eventConditionsMet(event: CityEventType) {
        var self = this,
            rtn = false;

        switch (event) {
            case CityEventType.MoneyGain:
            case CityEventType.MoneyLoss:
                rtn = true;
                break;
            case CityEventType.NewPusher:
            case CityEventType.NewSnitch:
                if (self.Control > 10) rtn = true;
                break;
            case CityEventType.SupplierFound:
            case CityEventType.SupplierBust:
                if (self.Control > 50) rtn = true;
                break;
            case CityEventType.OperationSuperYield:
            case CityEventType.OperationPoorYield:
            case CityEventType.OperationBust:
                if (self.Operations > 0) rtn = true;
                break;
        }

        return rtn;
    }

    transformToEvent(severity: number, positive: boolean) {
        var event = new CityEvent(this.Name);

        if (severity == 1) {
            if (positive) event.EventType = CityEventType.MoneyGain;
            else event.EventType = CityEventType.MoneyLoss;
        }
        else if (severity = 2) {
            if (positive) event.EventType = CityEventType.NewPusher;
            else event.EventType = CityEventType.NewSnitch;
        }
        else if (severity = 3) {
            if (positive) event.EventType = CityEventType.SupplierFound;
            else event.EventType = CityEventType.SupplierBust;
        }
        else if (severity = 4) {
            if (positive) event.EventType = CityEventType.OperationSuperYield;
            else event.EventType = CityEventType.OperationPoorYield;
        }
        else if (severity = 5) {
            if (positive) event.EventType = CityEventType.OperationSuperYield;
            else event.EventType = CityEventType.OperationBust;
        }

        return event;
    }
}

export class CityEvent {
    CityName: string;
    EventType: CityEventType;

    constructor(cityName: string) {
        this.CityName = cityName;
    }
}

export enum CityEventType {
    MoneyGain,
    MoneyLoss,
    NewPusher,
    NewSnitch,
    SupplierFound,
    SupplierBust,
    OperationSuperYield,
    OperationPoorYield,
    OperationBust
}

export enum Size {
    Small,
    Medium,
    Large
}