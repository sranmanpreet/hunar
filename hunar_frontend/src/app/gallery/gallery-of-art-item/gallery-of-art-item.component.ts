import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/shared/product.model';
import { MatDialog } from '@angular/material/dialog';
import { GalleryItemCartComponent } from '../gallery-item-cart/gallery-item-cart.component';

@Component({
  selector: 'app-gallery-of-art-item',
  templateUrl: './gallery-of-art-item.component.html',
  styleUrls: ['./gallery-of-art-item.component.css']
})
export class GalleryOfArtItemComponent implements OnInit {
  @Input() private galleryItem: Product;
  modelOpen = false;

  constructor(public dialog: MatDialog) { }

  openDialog(galleryItem: Product): void {
    const dialogRef = this.dialog.open(GalleryItemCartComponent, {
      width: '750px',
      panelClass: 'custom-dialog-container',
      data: { product: galleryItem },
      disableClose: true,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  ngOnInit() {
  }

  openImage() {
    this.modelOpen = true;
  }

  closeImage() {
    this.modelOpen = false;
  }

}
