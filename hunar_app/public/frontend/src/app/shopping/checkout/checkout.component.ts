import { Component, OnInit } from '@angular/core';
import { CheckoutNavService } from 'src/app/shared/services/checkout-nav.service';
import { ActivatedRoute } from '@angular/router';
import { AddressService } from 'src/app/shared/services/address.service';
import { ShoppingCartService } from '../../shared/services/shopping-cart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  constructor(
    private shoppingCartService: ShoppingCartService,
    private checkoutNavService: CheckoutNavService,
    private route: ActivatedRoute,
    private addressService: AddressService,
    private authService: AuthService,
    private cookieService: CookieService) { }

  ngOnInit() {
    /* this.route.data.subscribe(
      (data) => {
        if (data.addresses) {
          this.addressService.addresses = data.addresses;
        } else if (!this.authService.isLoggedIn() && this.cookieService.check('hunarSelectedAddress')) {
          this.addressService.addresses = [JSON.parse(this.cookieService.get('hunarSelectedAddress'))];
        }

        this.shoppingCartService.cart = data.cartItems;
      }
    ); */
  }

}
