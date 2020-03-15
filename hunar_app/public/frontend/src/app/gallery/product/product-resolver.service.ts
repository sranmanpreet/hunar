import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from 'src/app/shared/product.service';
import { Product } from 'src/app/shared/product.model';
import { ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ProductResolverService {
  constructor(private productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot,
  ): Observable<Product> {
    return this.productService.getProduct(route.paramMap.get('id'));
  }
}
