import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart } from '../../shopping/cart.model';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  cart;
  cartObserver = new Subject<Cart>();
  constructor(private http: HttpClient, private dataService: DataStorageService) { }

  getCart() {
    return this.http.get(environment.apiBaseUrl + '/cart');
  }


  addToCart(product) {
    this.dataService.addCartItem(product).subscribe((cart: Cart) => {
      this.cartObserver.next(cart);
    });
  }

  addToCartMakeToOrder(product){
    return this.http.post(environment.apiBaseUrl + 'make-to-order/add-to-cart' , product);
  }

  removeFromCart(product) {
    this.dataService.removeCartItem(product).subscribe((cart: Cart) => {
      this.cartObserver.next(cart);
    });
  }

  updateCartItemQuantity(product) {
    this.dataService.updateCartItemQty(product).subscribe((cart: Cart) => {
      this.cartObserver.next(cart);
    });
  }
}
