import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/shared/product.model';
import { ProductService } from 'src/app/shared/product.service';
import { ArtTypes, ArtSizes } from 'src/app/order/make-to-order/make-to-order.component';
import { Price } from 'src/app/shared/prices.model';
import { PricingService } from 'src/app/shared/pricing.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStorageService } from 'src/app/shared/data-storage.service';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit, OnDestroy {
  product: Product;
  productPrices: Price[];
  artTypes: ArtTypes[] = [];
  artSizes: ArtSizes[] = [];
  selectedArtType: string;
  selectedArtSize: string;
  selectedArtPrice: number;
  selectedArtPricingId: string;

  errorMessage: String;
  successMessage: String;

  constructor(private productService: ProductService, private pricingService: PricingService, private dataService: DataStorageService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data) => {
        this.productService.getProduct(data.product._id).subscribe(
          (product) => {
            this.product = product;
          },
          (err) => {
            console.log(err);
            alert(err);
          }
        )
      }
    );
    this.pricingService.getArtTypes().subscribe(
      (artTypes: ArtTypes[]) => {
        this.artTypes = artTypes;
      },
      (err) => {
        alert(err);
      }
    )
    this.pricingService.getArtSizes().subscribe(
      (artSizes: ArtSizes[]) => {
        this.artSizes = artSizes;
      },
      (err) => {
        alert(err);
      }
    )
  }

  addPricing(f: NgForm) {
    if (f.valid) {
      const newPrice = new Price(f.value.artType, f.value.artSize, f.value.price);
      this.dataService.addPricing(this.product["_id"], newPrice).subscribe(
        (product: Product) => {
          this.product = product;
          this.showMessage("Pricing added", true);
          f.reset();
        },
        (err) => {
          console.log(err);
          this.showMessage(err.error, false);
        }
      )
    } else {
      this.showMessage("Invalid pricing data", false);
    }
  }

  setFormForPricingUpdate(pricingId, artType, artSize, price) {
    this.selectedArtPricingId = pricingId;
    this.selectedArtType = artType;
    this.selectedArtSize = artSize;
    this.selectedArtPrice = price;
  }

  updatePricing(f: NgForm) {
    if (f.valid) {
      const updatedPricing = new Price(f.value.artType, f.value.artSize, f.value.price);
      this.dataService.updatePricing(this.product["_id"], updatedPricing, this.selectedArtPricingId).subscribe(
        (product: Product) => {
          this.product = product;
          this.showMessage("Pricing updated", true);
          f.reset();
          this.selectedArtPricingId = "";
        },
        (err) => {
          console.log(err);
          this.showMessage(err.error, false);
        }
      )
    } else {
      this.showMessage("Invalid pricing data", false);
    }
  }

  removePricing(productId: String, pricingId: String) {
    this.dataService.removePricing(productId, pricingId).subscribe(
      (product: Product) => {
        this.product = product;
        this.showMessage("Pricing deleted", true);
      },
      (err) => {
        this.showMessage(err.error, false);
      }
    );
  }

  showMessage(message: String, success: Boolean) {
    if (success) {
      this.successMessage = message;
    } else {
      this.errorMessage = message;
    }
    setTimeout(
      () => {
        this.errorMessage = "";
        this.successMessage = "";
      }, 3000);
  }

  editProduct(product: Product) {
    this.productService.setProduct(product);
    this.router.navigateByUrl('administration/manage/product/add');
  }

  resetForm(f: NgForm) {
    f.reset();
  }

  ngOnDestroy() {
  }

}
