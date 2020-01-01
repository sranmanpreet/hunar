import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  private product: Product;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data) => {
        const productId = this.route.snapshot.params['id'];
        data.products.forEach((p) => {
          if (p._id == productId) {
            this.product = p;
          }
        });
      }
    );
  }

}
