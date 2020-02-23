import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/shared/product.model';
import { ProductService } from 'src/app/shared/product.service';
import { ArtTypes, ArtSizes } from 'src/app/order/make-to-order/make-to-order.component';
import { Price } from 'src/app/shared/prices.model';
import { PricingService } from 'src/app/shared/pricing.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  product: Product;
  productPrices: Price[];
  artTypes: ArtTypes[] = [
    { name: 'Digital' },
    { name: 'Water Colors' },
    { name: 'Miniature' },
    { name: 'Charcoal' }
  ];
  artSizes: ArtSizes[] = [
    { value: 'A6' },
    { value: 'A5' },
    { value: 'A4' },
    { value: 'A3' },
    { value: 'A2' },
    { value: 'A1' }
  ];
  selectedArtType: string;
  selectedArtSize: string;
  selectedArtPrice: number;

  constructor(private productService: ProductService, private pricingService: PricingService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
      () => {
        const productId = this.route.snapshot.params['id'];
        this.productService.getProduct(productId).subscribe(
          (product) => {
            this.product = product;
            this.productPrices = this.product.pricing;
          },
          (err) => {
            console.log(err);
            alert(err);
          }
        )
      }
    );
  }

  addPricing(f: NgForm) {
    if (f.valid) {
      const newPrice = new Price(f.value.artType, f.value.artSize, f.value.price);
      this.productPrices = this.pricingService.addPricing(newPrice, this.productPrices);
    } else {
      alert("Invalid pricing data");
    }
  }

}
