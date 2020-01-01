import { Injectable } from '@angular/core';
import { Prices } from './prices.model';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  prices: Prices[] = [
    { artType: 'Canvas', artSize: 'A1', price: 600 },
    { artType: 'Canvas', artSize: 'A2', price: 500 },
    { artType: 'Canvas', artSize: 'A3', price: 400 },
    { artType: 'Canvas', artSize: 'A4', price: 300 },
    { artType: 'Digital', artSize: 'A1', price: 500 },
    { artType: 'Digital', artSize: 'A2', price: 400 },
    { artType: 'Digital', artSize: 'A3', price: 300 },
    { artType: 'Digital', artSize: 'A4', price: 200 },
    { artType: 'Charcoal', artSize: 'A1', price: 750 },
    { artType: 'Charcoal', artSize: 'A2', price: 650 },
    { artType: 'Charcoal', artSize: 'A3', price: 530 },
    { artType: 'Charcoal', artSize: 'A4', price: 440 }
  ];

  constructor() { }

  getPrices() {
    return this.prices;
  }
}
