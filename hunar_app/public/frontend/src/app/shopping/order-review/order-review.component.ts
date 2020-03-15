import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingCartService } from '../../shared/shopping-cart.service';
import { AddressService } from 'src/app/shared/address.service';
import { CheckoutNavService } from 'src/app/shared/checkout-nav.service';
import { map } from 'rxjs/operators';
import { Address } from 'src/app/shared/address.model';
import { Order } from 'src/app/shared/order.model';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/shared/order.service';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.css']
})
export class OrderReviewComponent implements OnInit, OnDestroy {
  cart;
  selectedAddress: Address;
  constructor(
    private shoppingCartService: ShoppingCartService,
    private addressService: AddressService,
    private checkoutNavService: CheckoutNavService,
    private dataStorageService: DataStorageService,
    private cookieService: CookieService,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.checkoutNavService.showProgressBar = true;
    this.selectedAddress = this.addressService.fetchSavedAddress();
    this.cart = JSON.parse(this.cookieService.get('hunarCart'));
  }

  onChangeAddress() {
    this.checkoutNavService.progressValue = 33;
    this.router.navigate(['/checkout/address']);
  }

  onPlaceOrder() {
    this.checkoutNavService.progressValue = 100;
    const order: Order = {
      orderItems: this.cart.cartItems,
      subtotal: this.cart.subtotal,
      shippingCost: this.cart.shippingCost,
      tax: this.cart.tax,
      total: this.cart.total,
      shippingAddressId: this.selectedAddress._id,
      billingAddressId: this.selectedAddress._id,
      paymentReferenceId: '123456',
      paymentMethod: 'Cash On Delivery',
      email: this.selectedAddress.email
    };
    this.dataStorageService.createOrder(order).subscribe((newOrder: Order) => {
      this.orderService.newOrder = newOrder;
      this.checkoutNavService.showProgressBar = false;
      this.orderService.showConfirmation = true;
      this.router.navigate(['/checkout/order-confirmation']);
    });
  }

  ngOnDestroy() {
  }

}
