import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../../shared/services/shopping-cart.service';
import { ActivatedRoute, Router, Data } from '@angular/router';
import { CheckoutNavService } from 'src/app/shared/services/checkout-nav.service';
import { Subscription, config } from 'rxjs';
import { AddressService } from 'src/app/shared/services/address.service';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/shared/services/auth.service';


@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  private cart;
  private promoCode;
  private promoCodeError;
  private subscriptionRoute: Subscription;
  private subscriptionCart: Subscription;
  constructor(
    private shoppingCartService: ShoppingCartService,
    private route: ActivatedRoute,
    private checkoutService: CheckoutNavService,
    private authService: AuthService,
    private router: Router,
    private addressService: AddressService,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.subscriptionRoute = this.route.data.subscribe(
      (data: Data) => {
        this.shoppingCartService.cart = data.cart;
      }
    );
  }

  calculateProductTotal(product) {
    return product.price * product.quantity;
  }

  incrementQty(product) {
    if (product.quantity < 5) {
      product.quantity = product.quantity + 1;
      this.shoppingCartService.updateCartItemQuantity(product);
      this.subscriptionCart = this.shoppingCartService.cartObserver.subscribe((cart) => { this.shoppingCartService.cart = cart; });
    }
  }

  decrementQty(product) {
    if (product.quantity > 1) {
      product.quantity = product.quantity - 1;
      this.shoppingCartService.updateCartItemQuantity(product);
      this.subscriptionCart = this.shoppingCartService.cartObserver.subscribe((cart) => { this.shoppingCartService.cart = cart; });
    }
  }

  removeProduct(product) {
    this.shoppingCartService.removeFromCart(product);
    this.subscriptionCart = this.shoppingCartService.cartObserver.subscribe((cart) => { this.shoppingCartService.cart = cart; });
  }

  onCheckout() {
    this.checkoutService.progressValue = 33;
    this.addressService.cart = this.shoppingCartService.cart;
    this.cookieService.set('hunarCart', JSON.stringify(this.addressService.cart));
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/checkout/address']);
    } else {
      this.router.navigate(['/sign-in'], { queryParams: { page: 'checkout-address' } });
    }
  }

  applyPromoCode() {
    if (this.promoCode) {
      this.promoCodeError = 'Invalid PromoCode';
    } else {
      this.promoCodeError = 'Enter PromoCode';
    }
    setTimeout(() => {
      this.promoCodeError = '';
    }, 3000);
  }

  ngOnDestroy() {
    if (this.subscriptionCart) {
      this.subscriptionCart.unsubscribe();
    }
    if (this.subscriptionRoute) {
      this.subscriptionRoute.unsubscribe();
    }
  }

}
