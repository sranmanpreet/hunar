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

  addPricing(newPrice: Price) {
    if (this.removeDuplicateKey(newPrice)) {
      return false;
    } else {
      this.dataStorageService.addPricingToProduct("sfs", newPrice).subscribe();
      this.prices.push(newPrice);
      return true;
    }
  }

  removeDuplicateKey(newPrice: Price) {
    for (let i = 0; i < this.prices.length; i++) {
      if (this.prices[i].artType === newPrice.artType && this.prices[i].artSize === newPrice.artSize) {
        //this.prices.splice(i,1);
        return true;
      }
    }
    return false;
  }
}
