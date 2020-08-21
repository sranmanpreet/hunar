import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ShoppingCartService } from 'src/app/shared/services/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery-item-cart',
  templateUrl: './gallery-item-cart.component.html',
  styleUrls: ['./gallery-item-cart.component.css']
})
export class GalleryItemCartComponent implements OnInit, OnDestroy {
  private artTypes = [];
  private artSizes = [];
  private selectedArtType = '';
  private selectedArtSize = '';
  private price;
  private serverMessage: string;
  private serverErrorMessage: string;
  private itemAdded: boolean;
  private galleryItemCartForm = new FormGroup({
    quantity: new FormControl(1, Validators.required),
    selectedArtType: new FormControl('', Validators.required),
    selectedArtSize: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    name: new FormControl(''),
    url: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<GalleryItemCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private shoppingCartService: ShoppingCartService,
    private router: Router) { }

  ngOnInit() {
    this.itemAdded = false;
    this.serverMessage = '';
    this.artTypes.length = 0;
    this.galleryItemCartForm.get('name').setValue(this.data.product.name);
    this.galleryItemCartForm.get('url').setValue(this.data.product.url);
    for (const pricing of this.data.product.pricing) {
      if (this.artTypes.indexOf(pricing.artType) === -1) {
        this.artTypes.push(pricing.artType);
      }
    }
  }

  setArtSizeDropdown(artType: string) {
    this.artSizes.length = 0;
    this.selectedArtSize = '';
    this.price = 0;
    this.serverMessage = '';
    this.itemAdded = false;
    this.galleryItemCartForm.value.quantity = 1;

    for (let i = 0; i < this.data.product.pricing.length; i++) {
      if (this.data.product.pricing[i].artType === artType) {
        this.artSizes.push(this.data.product.pricing[i].artSize);
      }
    }
  }

  incrementQty() {
    if (this.galleryItemCartForm.value.quantity < 5) {
      this.serverMessage = '';
      this.itemAdded = false;
      this.galleryItemCartForm.value.quantity += 1;
      this.galleryItemCartForm.get('quantity').setValue(this.galleryItemCartForm.value.quantity);
      this.getPrice();
    } else {
      this.serverErrorMessage = 'Maximum order quantity is 5. For bulk orders, please email us at contact@inderjitchitterkar.com';
      setTimeout(() => { this.serverErrorMessage = ''; }, 5000);
    }
  }
  decrementQty() {
    if (this.galleryItemCartForm.value.quantity > 1) {
      this.serverMessage = '';
      this.itemAdded = false;
      this.galleryItemCartForm.value.quantity -= 1;
      this.galleryItemCartForm.get('quantity').setValue(this.galleryItemCartForm.value.quantity);
      this.getPrice();
    }
  }

  getPrice(artType?: string, artSize?: string) {
    if (this.galleryItemCartForm.value.selectedArtType && this.galleryItemCartForm.value.selectedArtSize) {
      for (let i = 0; i < this.data.product.pricing.length; i++) {
        if ((this.data.product.pricing[i].artType === this.galleryItemCartForm.value.selectedArtType) && (this.data.product.pricing[i].artSize === this.galleryItemCartForm.value.selectedArtSize)) {
          this.galleryItemCartForm.get('price').setValue(this.data.product.pricing[i].price);
        }
      }
    }
    this.serverMessage = '';
    this.itemAdded = false;
  }

  onSubmit() {
    if (this.galleryItemCartForm.valid) {
      const value = this.galleryItemCartForm.value;
      const product = {
        productId: this.data.product._id,
        productType: 'Gallery', name: value.name, imgurl: value.url, artType: value.selectedArtType, artSize: value.selectedArtSize,
        price: value.price, quantity: value.quantity
      };
      this.shoppingCartService.addToCart(product);
      this.serverMessage = 'Item added to cart';
      this.itemAdded = true;
    }
  }

  goToCart() {
    this.dialogRef.close();
    this.router.navigate(['/shopping-cart']);
  }

  continueShopping(): void {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.itemAdded = false;
    this.serverMessage = '';
  }

}
