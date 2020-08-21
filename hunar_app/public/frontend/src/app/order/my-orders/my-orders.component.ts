import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/shared/services/order.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Data } from '@angular/router';
import { Order } from 'src/app/shared/models/order.model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private myOrders: Order[];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.data.subscribe(
      (data: Data) => {
        this.myOrders = data.orders;
        this.sortBy('date');
      }
    );
  }

  sortBy(field: string) {

    this.myOrders.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return 1;
      } else if (a[field] > b[field]) {
        return -1;
      } else {
        return 0;
      }
    });
    this.myOrders = this.myOrders;
  }

  calculateProductTotal(order) {
    return order.quantity * order.price;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
