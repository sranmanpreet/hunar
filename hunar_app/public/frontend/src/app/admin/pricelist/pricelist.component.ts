import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PricingService } from 'src/app/shared/services/pricing.service';
import { ArtType } from 'src/app/shared/models/art-type.model';
import { ArtSize } from 'src/app/shared/models/art-size.model';
import { Price } from 'src/app/shared/models/prices.model';

@Component({
  selector: 'app-pricelist',
  templateUrl: './pricelist.component.html',
  styleUrls: ['./pricelist.component.css']
})
export class PricelistComponent implements OnInit {
  pricelist: Price[] = [];
  artTypes: ArtType[] = [];
  artSizes: ArtSize[] = [];
  selectedArtType: string;
  selectedArtSize: string;
  selectedArtPrice: number;
  selectedArtPersonCount: number;
  selectedArtPricingId: string;

  errorMessage: String;
  successMessage: String;

  constructor(private pricingService: PricingService) { }

  ngOnInit() {
    this.pricingService.getPricelist().subscribe(
      (pricelist: Price[]) => {
        this.pricelist = pricelist;
      },
      (err) => {
        console.log(err);
      }
    );

    this.pricingService.getArtTypes().subscribe(
      (artTypes: ArtType[]) => {
        this.artTypes = artTypes;
      },
      (err) => {
        alert(err);
      }
    )
    this.pricingService.getArtSizes().subscribe(
      (artSizes: ArtSize[]) => {
        this.artSizes = artSizes;
      },
      (err) => {
        alert(err);
      }
    )
  }

  addPrice(f: NgForm) {
    if (f.valid) {
      const newPrice = new Price(f.value.artType, f.value.artSize, f.value.price, f.value.personCount);
      this.pricingService.addPrice(newPrice).subscribe(
        (response) => {
          this.pricingService.getPricelist().subscribe(
            (pricelist: Price[])=>{
              this.pricelist = pricelist;
              this.showMessage("Price added", true);
              f.reset();
            }
          );
        },
        (err) => {
          this.showMessage(err.error, false);
        }
      )
    } else {
      this.showMessage("Invalid pricing data", false);
    }
  }

  deletePrice(pricingId: String) {
    this.pricingService.deletePrice(pricingId).subscribe(
      (response) => {
        this.pricingService.getPricelist().subscribe(
          (pricelist: Price[])=>{
            this.pricelist = pricelist;
            this.showMessage("Price deleted", true);
          }
        )
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

  resetForm(f: NgForm) {
    f.reset();
  }
}
