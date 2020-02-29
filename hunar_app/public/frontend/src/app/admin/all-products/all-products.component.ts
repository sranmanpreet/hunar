import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/product.service';
import { Product } from 'src/app/shared/product.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit {
  private products: Product[];

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

}
