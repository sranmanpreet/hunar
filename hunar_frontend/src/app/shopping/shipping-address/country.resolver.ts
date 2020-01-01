import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { AddressService } from 'src/app/shared/address.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CountryResoverService implements Resolve<{ _id: string, id: number, sortname: string, name: string, phoneCode: number }> {

    constructor(private addressService: AddressService) { }

    resolve(): Observable<{ _id: string, id: number, sortname: string, name: string, phoneCode: number }> {
        return this.addressService.getCountries();
    }
}
