import { Injectable } from '@angular/core';
import { Price } from './prices.model';

@Injectable({
  providedIn: 'root'
})
export class PricingService {

  constructor() { }

  addPricing(newPrice: Price, productPrices: Price[]) {
    if (this.removeDuplicateKey(newPrice, productPrices)) {
      alert("Record already exists");
    } else {
      productPrices.push(newPrice);
    }
    return productPrices;
  }

  removeDuplicateKey(newPrice: Price, productPrices: Price[]) {
    for (let i = 0; i < productPrices.length; i++) {
      if (productPrices[i].artType === newPrice.artType) {
        if (productPrices[i].artSize === newPrice.artSize) {
          return true;
        }
      }
    }
    return false;
  }
}
