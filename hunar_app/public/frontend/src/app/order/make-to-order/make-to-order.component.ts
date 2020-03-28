import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PricingService } from 'src/app/shared/services/pricing.service';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';
import { ArtType } from 'src/app/shared/models/art-type.model';
import { ArtSize } from 'src/app/shared/models/art-size.model';

@Component({
  selector: 'app-make-to-order',
  templateUrl: './make-to-order.component.html',
  styleUrls: ['./make-to-order.component.css']
})
export class MakeToOrderComponent implements OnInit {
  defaultImage = '../../../assets/images/footer-fb.png';
 
  showDate: false;
  expectedDeliveryDate: Date;
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 1, 0, 0);
 
  artTypes: ArtType[] = [];
  artSizes: ArtSize[] = [];
  selectedArtType: string;
  selectedArtSize: string;
 
  instructions: string;
  instructionsRegex = /^[a-zA-Z0-9 ,.']{1,1000}$/;

  imageFileData: File;
  previewImage: string | ArrayBuffer;
  fileUploadProgress: string = null;
  message: string;

  constructor(private pricingService: PricingService, private shoppingCartService: ShoppingCartService, private router: Router) { }

  ngOnInit() {
    this.pricingService.getArtTypes().subscribe(
      (artTypes: ArtType[]) => {
        this.artTypes = artTypes;
      },
      (err) => {
        console.log(err);
      }
    )
    this.pricingService.getArtSizes().subscribe(
      (artSizes: ArtSize[]) => {
        this.artSizes = artSizes;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  onFileSelect(event) {
    this.message = '';
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if(file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png'){
        if(file.size <= 1000000){          
          this.imageFileData = <File>event.target.files[0];
          this.preview();
        } else {
          this.previewImage = '';
          this.message = "File size should be upto 1 MB";
        }
      } else {
        this.previewImage = '';
        this.message = "Only jpeg, jpg and png files are allowed.";
      }
    }
  }

  preview() {
    const reader = new FileReader();

    reader.readAsDataURL(this.imageFileData); // read file as data url

    reader.onload = (_event) => { // called once readAsDataURL is completed
      this.previewImage = reader.result;
    };
  }

  onAddToCart(f: NgForm) {
    if (f.valid && f.dirty) {
      console.log(f.value);
      if (!this.previewImage) {
        this.message = "Please select an image.";
      } else {
        const productFormData = new FormData();
        productFormData.append('productType', 'Exclusive');
        productFormData.append('name', f.value.name);
        productFormData.append('artType', f.value.selectedArtType);
        productFormData.append('artSize', f.value.selectedArtSize);
        productFormData.append('productImage', this.imageFileData);
        console.log(productFormData);
/* 
        productType: "Gallery"
name: "Child and Bangles"
imgurl: "assets\products\14-03-2020_17-00-40_work1.jpg"
artType: "Water Colors"
artSize: "A4"
price: 3450
quantity: 2 */
       // this.shoppingCartService.addToCart(productFormData);
      }
    }
  }

  onContinue(f: NgForm) {
    if(f.valid){
      console.log(f.value);
    } else {
      console.log("Invalid data");
    }
  }

}
