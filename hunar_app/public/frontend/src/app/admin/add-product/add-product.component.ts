import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProductService } from 'src/app/shared/services/product.service';
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
  message: string;

  nameRegex = /^[a-zA-Z0-9 ]{1,30}$/;
  descriptionRegex = /^[a-zA-Z0-9 ,.']{1,1000}$/;

  constructor(private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.editProductView();
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

  onAddProduct(f: NgForm, event: Event) {
    if (f.valid && f.dirty) {
      if (!this.previewImage) {
        this.message = "Please select an image.";
      } else {
        event.preventDefault();
        const productFormData = new FormData();
        productFormData.append('name', f.value.name);
        productFormData.append('description', f.value.description);
        productFormData.append('productImage', this.imageFileData);
        this.productService.addProduct(productFormData).subscribe(
          (product) => {
            this.router.navigateByUrl("administration/manage/product/" + product['_id'] + "/pricing");
          },
          (error) => {
            this.message = error.error;
            console.log(error.error);
          });
      }
    }
  }

  onUpdateProduct(f: NgForm, event: Event) {
    if (f.valid && f.dirty) {
      if (!this.previewImage) {
        alert("Please select an image.");
      } else {
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
            this.message = error;
          });
      }
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
