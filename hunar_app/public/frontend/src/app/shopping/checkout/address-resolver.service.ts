import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Address } from 'src/app/shared/address.model';
import { AddressService } from 'src/app/shared/address.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddressResolverService implements Resolve<Address[]> {

  constructor(private addressService: AddressService) { }

  resolve(): Observable<Address[]> {
    return this.addressService.getAddress();
  }
}
