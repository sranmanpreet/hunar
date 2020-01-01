import { Injectable } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from 'src/app/shared/order.model';
import { map } from 'rxjs/operators';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { OrderService } from 'src/app/shared/order.service';

@Injectable({
    providedIn: 'root'
})
export class OrderReviewResolverService implements Resolve<Order> {

    constructor(
        private dataStorageService: DataStorageService,
        private orderService: OrderService) { }

    resolve(): Observable<Order> {
        return this.dataStorageService.getOrder(this.orderService.newOrder).pipe(map((order: Order) => {
            return order;
        }));
    }
}
