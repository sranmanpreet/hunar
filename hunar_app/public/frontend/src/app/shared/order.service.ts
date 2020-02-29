import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public newOrder: Order;
  public showConfirmation = true;

  constructor(
    private dataService: DataStorageService
  ) { }

}
