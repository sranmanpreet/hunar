import { Injectable } from '@angular/core';

import { Product } from './product.model';
import { DataStorageService } from './data-storage.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
const desc = 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Commodi laborum hic beatae corrupti totam accusantium incidunt reiciendis at impedit illo sapiente qui eveniet adipisci, repellendus quia debitis voluptatem ipsa, voluptates placeat fugit facere veritatis deserunt nisi distinctio. Maxime perspiciatis aspernatur nam, nemo debitis eius voluptatem iusto animi velit reprehenderit molestias aliquam, deserunt doloribus quod accusantium cum hic quibusdam tempore, minima sapiente? Sed, facilis placeat optio voluptas nihil officiis expedita, doloribus illo quasi delectus voluptate vero. Dicta provident sint in repellat expedita. Excepturi neque molestias quos minus ut culpa placeat quaerat quo accusamus! Nam magni consequatur, nulla eaque sit eligendi at.';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  images: Product[];
  allProducts: Product[];
  productToBeEdited: Product;

  constructor(private dataService: DataStorageService) { }

  getProducts(): Observable<Product[]> {
    return this.dataService.fetchGalleryImages().pipe(map(
      (images: Product[]) => {
        return this.images = images;
      },
      (err) => {
        return err;
      }
    ));
  }

  getAllProducts(): Observable<Product[]> {
    return this.dataService.fetchAllProducts().pipe(map(
      (products: Product[]) => {
        return this.allProducts = products;
      },
      (err) => {
        return err;
      }
    ));
  }

  getProduct(id): Observable<Product> {
    return this.dataService.fetchGalleryImage(id).pipe(map(
      (product: Product) => {
        return product;
      },
      (err) => {
        return err;
      }
    ));
  }

  addProduct(product: any){
    return this.dataService.addProduct(product);
  }

  deleteProduct(productId: String){
    return this.dataService.deleteProduct(productId);
  }

  setProduct(product: Product){
    this.productToBeEdited = product;
  }

}
