import { Price } from './prices.model';

export class Product {
    constructor(public id: number, public name: string, public url: string, public pricing: Price[], public description: string) { }
}
