import { Injectable } from '@angular/core';
import { Price } from './prices.model';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  prices: Price[] = [];

  constructor(private dataStorageService: DataStorageService) { }

  getPrices() {
    return this.prices;
  }

  addPricing(newPricing: Price[]) {
    this.prices.concat(newPricing);
  }

  overrideDuplicatePricing(newPrice: Price, currentPrices: Price[]) {
    let isDuplicate = false;
    for (let i = 0; i < currentPrices.length; i++) {
      if (currentPrices[i].artType === newPrice.artType && currentPrices[i].artSize === newPrice.artSize) {
        if(currentPrices[i].price === newPrice.price){
          isDuplicate = true;
          alert("Pricing already exist");
          return currentPrices;
        } else{
          isDuplicate = true;
          if(confirm("Pricing already exist. Do you want to override it?")){
             currentPrices.splice(i,1);
             currentPrices.push(newPrice);
             return currentPrices;
          } else {
            return currentPrices;
          }
        }
      }
    }
    if(!isDuplicate){
      currentPrices.push(newPrice);
    }
    return currentPrices;
  }
}
