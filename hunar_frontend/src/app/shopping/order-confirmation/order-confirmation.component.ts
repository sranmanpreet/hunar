import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/shared/order.service';
import { CheckoutNavService } from 'src/app/shared/checkout-nav.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit, OnDestroy {
  order;
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private checkoutNavService: CheckoutNavService) { }

  ngOnInit() {
    /* this.route.data.subscribe(
      (data) => {
        this.order = data.order;
      }
    ); */
    this.order = this.orderService.newOrder;
  }

  ngOnDestroy() {
    this.orderService.showConfirmation = false;
  }

}
