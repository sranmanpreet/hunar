import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AddressService } from 'src/app/shared/address.service';
import { Address } from 'src/app/shared/address.model';
import { CheckoutNavService } from 'src/app/shared/checkout-nav.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shared/auth.service';
/* import { CookieService } from 'ngx-cookie-service'; */
import { ShoppingCartService } from 'src/app/shared/shopping-cart.service';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css']
})
export class ShippingAddressComponent implements OnInit {
  emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
  nameRegex = /^[a-zA-Z_]{0,30}$/;
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  addressRegex = /^[,. 0-9a-zA-Z_]{0,80}$/;
  phoneRegex = /^[0-9_]{10}$/;
  postalCodeRegex = /^[0-9_]{6}$/;
  private addresses: Address[] = [];
  private showNewAddressForm = true;
  private countries = [];
  private states = [];
  private cities = [];
  // private showEmail = false;

  private firstName: string;
  private lastName: string;
  private addressLine1: string;
  private addressLine2: string;
  private city;
  private state;
  private country;
  private postalCode: string;
  private phone: string;
  private email: string;

  constructor(
    private addressService: AddressService,
    private checkoutNavService: CheckoutNavService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    /*     private cookieService: CookieService, */
    private shoppingCartService: ShoppingCartService) { }

  ngOnInit() {
    this.checkoutNavService.showProgressBar = true;
    /*    if (!this.authService.isLoggedIn()) {
         this.showEmail = true;
       } */
    this.route.data.subscribe(
      (data) => {
        this.countries = data.countries;
        this.countries.sort(this.predicateBy('name'));
        if (data.addresses) {
          this.addressService.addresses = data.addresses;
        } /* else if (!this.authService.isLoggedIn() && this.cookieService.check('hunarSelectedAddress')) {
          this.addressService.addresses = [JSON.parse(this.cookieService.get('hunarSelectedAddress'))];
        } */

        this.shoppingCartService.cart = data.cartItems;
      }
    );
    this.addresses = this.addressService.addresses;
    if (this.addresses && this.addresses.length) {
      this.showNewAddressForm = false;
    }
  }

  predicateBy(prop) {
    return (a, b) => {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    };
  }

  setStateDropdown(country) {
    this.state = null;
    this.addressService.getStates(country).subscribe((states) => {
      this.states = states;
      this.states.sort(this.predicateBy('name'));
    });
  }

  setCityDropdown(country, state) {
    this.city = null;
    this.addressService.getCities(country, state).subscribe((cities) => {
      this.cities = cities;
      this.cities.sort(this.predicateBy('name'));
    });
  }

  onSubmit(addressForm) {
    if (addressForm.valid) {
      console.log('valid form');
      const form = addressForm.value;
      form.city = form.city._id;
      form.state = form.state._id;
      form.country = form.country._id;
      console.log(form);
      this.addressService.addAddress(form);
    } else {
      console.log('invalid form');
    }
  }

  onEditAddress(address: Address, form: NgForm) {
    console.log(address);
    this.firstName = address.firstName;
    this.lastName = address.lastName;
    this.addressLine1 = address.addressLine1;
    this.addressLine2 = address.addressLine2;
    this.country = address.country;
    this.state = address.state;
    this.city = address.city;
    this.setStateDropdown(address.country);
    this.setCityDropdown(address.country, address.state);
    this.phone = address.phone;
    this.postalCode = address.postalCode;
    this.showNewAddressForm = true;
  }

  onAdd() {
    this.showNewAddressForm = !this.showNewAddressForm;
  }

  onSelect(address: Address) {
    this.addressService.saveSelectedAddress(address);
    this.checkoutNavService.progressValue = 66;
    this.router.navigate(['/checkout/order-summary']);
  }

  onCancel() {
    this.showNewAddressForm = false;
  }

  onDelete(address: Address) {
    if (this.authService.isLoggedIn()) {
      this.addressService.deleteAddress(address);
      if (this.addresses.length === 1) {
        this.showNewAddressForm = true;
      }
    }/*  else {
      this.cookieService.delete('hunarSelectedAddress');  
    } */
  }

}
