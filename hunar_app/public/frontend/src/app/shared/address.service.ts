import { Injectable } from '@angular/core';
import { Address } from './address.model';
import { DataStorageService } from './data-storage.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart } from '../shopping/cart.model';
import { CheckoutNavService } from './checkout-nav.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addresses: Address[] = [];
  cart: Cart;

  constructor(
    private dataService: DataStorageService,
    private checkoutNavService: CheckoutNavService,
    private router: Router,
    private cookieService: CookieService) {
  }

  getCountries(): any {
    return this.dataService.fetchCountries().pipe(map((countries => {
      return countries;
    })));
  }

  getStates(country): any {
    return this.dataService.fetchStates(country).pipe(map((states => {
      return states;
    })));
  }

  getCities(country, state): any {
    return this.dataService.fetchCities(country, state).pipe(map((cities => {
      return cities;
    })));
  }

  saveSelectedAddress(address: Address) {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    this.cookieService.set('hunarSelectedAddress', JSON.stringify(address), expiredDate);
  }

  fetchSavedAddress(): Address {
    const selectedAddress = this.cookieService.get('hunarSelectedAddress');
    return JSON.parse(selectedAddress);
  }

  addAddress(address: Address) {
    this.dataService.saveAddress(address).subscribe((newAddress: Address) => {
      if (this.addresses) {
        this.addresses.push(newAddress);
      } else {
        this.addresses = [newAddress];
      }
      this.saveSelectedAddress(newAddress);
      this.checkoutNavService.progressValue = 66;
      this.router.navigate(['/checkout/order-summary']);
    });
  }

  getAddress(): Observable<Address[]> {
    return this.dataService.fetchAddress().pipe(map(
      (data: Address[]) => {
        return this.addresses = data;
      },
      (err) => {
        return err;
      }
    ));
  }

  deleteAddress(address: Address) {
    this.dataService.deleteAddress(address).subscribe(
      (success) => {
        const index: number = this.addresses.indexOf(address);
        if (index !== -1) {
          this.addresses.splice(index, 1);
        }

        console.log(success);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
