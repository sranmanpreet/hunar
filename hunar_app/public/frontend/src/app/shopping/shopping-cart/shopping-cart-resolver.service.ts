import { Injectable } from '@angular/core';
import { ShoppingCartService } from '../../shared/services/shopping-cart.service';
import { Cart } from '../cart.model';
import { Observable } from 'rxjs';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartResolverService {
  constructor(
    private shoppingCartService: ShoppingCartService,
    private dataService: DataStorageService) { }

  resolve(): Observable<any> | Promise<Cart> | Cart {
    return this.shoppingCartService.getCart();
  }
}
