import _ = require('underscore');

export class City {
    Name: string;
    Size: Size;
    Neighbors: City[];

    constructor(name: string, size: Size) {
        this.Name = name;
        this.Size = size;
        this.Neighbors = [];
    }

    addNeighbor(city: City) {
        if (!_.any(this.Neighbors, function (n: City) { return n.Name == city.Name; })) {
            this.Neighbors.push(city);
            city.addNeighbor(this);
        }

        return this;
    }
}

export enum Size {
    Small,
    Medium,
    Large
}