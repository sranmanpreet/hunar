import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/shared/product.service';
import { Product } from 'src/app/shared/product.model';

@Injectable({
  providedIn: 'root'
})
export class AllProductsResolverService {
  constructor(private productService: ProductService) { }

  resolve(): Observable<Product[]> {
    return this.productService.getAllProducts();
  }
}
