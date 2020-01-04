import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ArtSizes, ArtTypes } from 'src/app/order/make-to-order/make-to-order.component';
import { PricingService } from 'src/app/shared/pricing.service';
import { Price } from 'src/app/shared/prices.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  name: string;
  description: string;
  image: string | ArrayBuffer;
  photo = false;
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
  productPrices: Price[];

  constructor(private pricingService: PricingService) { }

  ngOnInit() {
    this.productPrices = this.pricingService.getPrices();
  }

  onFileSelect(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.image = reader.result;
        this.photo = true;
      };
    }

  }

  onAddProduct(f: NgForm) {
    if (f.valid) {
      console.log(f.value);
    } else {
      console.log("Invalid product data");
    }
  }
  addPricing(f: NgForm) {
    if (f.valid) {
      const newPrice = new Price(f.value.artType, f.value.artSize, f.value.price);
      if(this.pricingService.addPricing(newPrice)){
        this.productPrices = this.pricingService.getPrices();
      } else {
        alert("Pricing already exist for this combination");
      }
    } else {
      console.log("Invalid pricing data");
    }
  }

}
