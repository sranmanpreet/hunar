import { Price } from './prices.model';

export class Product {
    constructor(public name: string, public description: string, public pricing: Price[], public url?: string, public id?: number) { }
}
