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

  constructor(private pricingService: PricingService) { }

  ngOnInit() {
    
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

}
