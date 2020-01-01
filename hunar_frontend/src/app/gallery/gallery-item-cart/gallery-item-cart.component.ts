import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { ShoppingCartService } from 'src/app/shared/shopping-cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery-item-cart',
  templateUrl: './gallery-item-cart.component.html',
  styleUrls: ['./gallery-item-cart.component.css']
})
export class GalleryItemCartComponent implements OnInit, OnDestroy {
  private artDetails: any[][] = new Array();
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
    for (const artTypeValue of this.data.product.pricing.artType) {
      this.artTypes.push(artTypeValue.lookupName);
    }
    let artTypeCounter;
    let artSizeCounter;
    const a = this.data.product.pricing.artType;
    // tslint:disable-next-line: prefer-for-of
    for (artTypeCounter = 0; artTypeCounter < this.data.product.pricing.artType.length; artTypeCounter++) {
      for (artSizeCounter = 0; artSizeCounter < a[artTypeCounter].artSize.length; artSizeCounter++) {
        this.artDetails.push([a[artTypeCounter].lookupName, a[artTypeCounter].artSize[artSizeCounter].lookupName,
        a[artTypeCounter].artSize[artSizeCounter].price]);
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
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.data.product.pricing.artType.length; i++) {
      if (this.data.product.pricing.artType[i].lookupName === artType) {
        for (const artSizeValue of this.data.product.pricing.artType[i].artSize) {
          this.artSizes.push(artSizeValue.lookupName);
        }
        break;
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

  getPrice() {
    for (const art of this.artDetails) {
      if (art[0] === this.galleryItemCartForm.value.selectedArtType) {
        if (art[1] === this.galleryItemCartForm.value.selectedArtSize) {
          this.galleryItemCartForm.get('price').setValue(art[2]);
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
