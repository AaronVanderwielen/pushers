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
}

export enum Size {
    Small,
    Medium,
    Large
}