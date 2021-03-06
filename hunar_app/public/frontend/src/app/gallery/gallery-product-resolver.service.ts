import { Injectable } from '@angular/core';
import { ProductService } from '../shared/services/product.service';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class GalleryProductResolverService {
  constructor(private productService: ProductService) { }

  resolve(): Observable<Product[]> {
    return this.productService.getProducts();
  }
}
