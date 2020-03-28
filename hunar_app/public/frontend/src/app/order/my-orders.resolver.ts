import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { OrderService } from '../shared/services/order.service';
import { Order } from '../shared/models/order.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MyOrdersResolver {
    constructor(
        private orderService: OrderService,
        private dataService: DataStorageService) { }

    resolve(): Observable<any> | Promise<Order[]> | Order[] {
        return this.dataService.getOrders().pipe(map((orders: Order[]) => {
            return orders;
        }));
    }
}
