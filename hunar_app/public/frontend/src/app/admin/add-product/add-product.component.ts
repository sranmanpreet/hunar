import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ArtSizes, ArtTypes } from 'src/app/order/make-to-order/make-to-order.component';
import { PricingService } from 'src/app/shared/pricing.service';
import { Price } from 'src/app/shared/prices.model';
import { ProductService } from 'src/app/shared/product.service';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit, OnDestroy {
  name: string;
  description: string;
  imageFileData: File;
  previewImage: string | ArrayBuffer;
  fileUploadProgress: string = null;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.editProductView();
  }

  onFileSelect(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFileData = <File>event.target.files[0];
      this.preview();
    }

  }

  preview() {
    const reader = new FileReader();

    reader.readAsDataURL(this.imageFileData); // read file as data url

    reader.onload = (_event) => { // called once readAsDataURL is completed
      this.previewImage = reader.result;
    };
  }

  onAddProduct(f: NgForm, event: Event) {
    if (f.valid) {
      event.preventDefault();
      const productFormData = new FormData();
      productFormData.append('name', f.value.name);
      productFormData.append('description', f.value.description);
      productFormData.append('productImage', this.imageFileData);
      this.productService.addProduct(productFormData).subscribe(
        (product) => {
          console.log(" iam here " + product);
          this.router.navigateByUrl("administration/manage/product/" + product['_id'] + "/pricing");
        },
        (error) => {
          console.log(error);
        });
    } else {
      alert("Invalid product data");
    }
  }

  onUpdateProduct(f: NgForm, event: Event) {
    if (f.valid) {
      event.preventDefault();
      const productFormData = new FormData();
      productFormData.append('name', f.value.name);
      productFormData.append('description', f.value.description);
      if (this.imageFileData) {
        productFormData.append('productImage', this.imageFileData);
      }
      this.productService.updateProduct(productFormData, this.productService.productToBeEdited['_id']).subscribe(
        (product) => {
          this.router.navigateByUrl("administration/manage/product/" + product['_id'] + "/pricing");
        },
        (error) => {
          console.log(error);
        });
    } else {
      alert("Invalid product data");
    }
  }

  editProductView() {
    if (this.productService.productToBeEdited) {
      this.name = this.productService.productToBeEdited.name;
      this.description = this.productService.productToBeEdited.description;
      this.previewImage = this.productService.productToBeEdited.url;
    }
  }

  ngOnDestroy() {
    this.productService.setProduct(null);
  }

}
