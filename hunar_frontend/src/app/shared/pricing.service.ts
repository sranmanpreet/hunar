import { Injectable } from '@angular/core';
import { Price } from './prices.model';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  prices: Price[] = [];

  constructor() { }

  getPrices() {
    return this.prices;
  }

  addPricing(newPrice: Price){
    if(this.removeDuplicateKey(newPrice)){
      return false;
    } else{
      this.prices.push(newPrice);
      return true;
    }
  }

  removeDuplicateKey(newPrice: Price){
    for(let i=0; i<this.prices.length; i++){
      if(this.prices[i].artType === newPrice.artType){
        if(this.prices[i].artSize === newPrice.artSize){
          //this.prices.splice(i,1);
          return true;
        }
      }
    }
    return false;
  }
}
