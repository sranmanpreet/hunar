import { Component, OnInit } from '@angular/core';

import { Product } from '../../shared/models/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-gallery-of-art',
  templateUrl: './gallery-of-art.component.html',
  styleUrls: ['./gallery-of-art.component.css']
})
export class GalleryOfArtComponent implements OnInit {
  products: Product[];

  constructor(
    private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data) => {
        this.products = data.products;
      }
    );
  }
}
