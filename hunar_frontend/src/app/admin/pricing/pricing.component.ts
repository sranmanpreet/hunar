import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/shared/product.model';
import { ProductService } from 'src/app/shared/product.service';
import { ArtTypes, ArtSizes } from 'src/app/order/make-to-order/make-to-order.component';
import { Price } from 'src/app/shared/prices.model';
import { PricingService } from 'src/app/shared/pricing.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit, OnDestroy {
  product: Product;
  productPrices: Price[];
  pricingSubscription: Subscription;
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

  constructor(private productService: ProductService, private pricingService: PricingService, private dataService: DataStorageService, private route: ActivatedRoute) { }

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
      this.dataService.addPricing(this.product["_id"], newPrice).subscribe(
        (product: Product) => {
          this.product = product;
          this.productPrices = product.pricing;
        },
        (err) => {
          console.log(err);
        }
      )
    } else {
      alert("Invalid pricing data");
    }
  }

  removePricing(productId: String, pricingId: String) {
    this.dataService.removePricing(productId, pricingId).subscribe(
      (product: Product) => {
        this.product = product;
        this.productPrices = product.pricing;
      }
    );
  }

  ngOnDestroy() {
    this.pricingSubscription.unsubscribe();
  }

}
