import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/shared/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  private products: Product[];
  showSpinner: boolean = false;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data) => {
        this.products = data.products;
      }
    );
  }

  viewPricingDetails(product: Product) {
    this.router.navigateByUrl('administration/manage/product/' + product["_id"] + '/pricing');
  }

  deleteProduct(productId: String) {
    this.showSpinner = true;
    this.productService.deleteProduct(productId).subscribe(
      (err) => {
        console.log(err);
        this.showSpinner = false;
      },
      (result) => {
        this.products.forEach((product, index) => {
          if (product.id.toString() == productId) {
            this.products.splice(index, 1);
          }
        });
        this.showSpinner = false;
      }
    )
  }

}
