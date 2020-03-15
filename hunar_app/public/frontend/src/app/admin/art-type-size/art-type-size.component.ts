import { Component, OnInit } from '@angular/core';
import { PricingService } from 'src/app/shared/pricing.service';
import { ArtTypes, ArtSizes } from 'src/app/order/make-to-order/make-to-order.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-art-type-size',
  templateUrl: './art-type-size.component.html',
  styleUrls: ['./art-type-size.component.css']
})
export class ArtTypeSizeComponent implements OnInit {
  artTypes: ArtTypes[];
  message: string;

  nameRegex = /^[a-zA-Z0-9 ]{1,30}$/;
  artSizes: ArtSizes[];

  constructor(private pricingService: PricingService) { }

  ngOnInit(){
    this.pricingService.getArtTypes().subscribe(
      (artTypes: ArtTypes[]) => {
        this.artTypes = artTypes;
      },
      (err) => {
        alert(err.error);
      }
    );

    this.pricingService.getArtSizes().subscribe(
      (artSizes: ArtSizes[]) => {
        this.artSizes = artSizes;
      },
      (err) => {
        alert(err.error);
      }
    );
  }

  addArtType(f: NgForm){
    if(f.valid){
      this.pricingService.addArtType({value: f.value.artType}).subscribe(
        () => {
          this.pricingService.getArtTypes().subscribe(
            (artTypes: ArtTypes[]) => {
              this.artTypes = artTypes;
              f.reset();
            },
            (err) => {
              alert(err.error);
            }
          );
        },
        (err) => {
          alert(err.error);
        }
      );
    }
  }

  deleteArtType(artTypeId){
    this.pricingService.deleteArtType(artTypeId).subscribe(
      ()=>{
        this.pricingService.getArtTypes().subscribe(
          (artTypes: ArtTypes[]) => {
            this.artTypes = artTypes;
          },
          (err) => {
            alert(err.error);
          }
        );
      }
    );
  }
  addArtSize(f: NgForm){
    if(f.valid){
      this.pricingService.addArtSize({value: f.value.artSize}).subscribe(
        () => {
          this.pricingService.getArtSizes().subscribe(
            (artSizes: ArtSizes[]) => {
              this.artSizes = artSizes;
              f.reset();
            },
            (err) => {
              alert(err.error);
            }
          );
        },
        (err) => {
          console.log(err);
          alert(err.error);
        }
      );
    }
  }

  deleteArtSize(artSizeId){
    this.pricingService.deleteArtSize(artSizeId).subscribe(
      ()=>{
        this.pricingService.getArtSizes().subscribe(
          (artSizes: ArtSizes[]) => {
            this.artSizes = artSizes;
          },
          (err) => {
            alert(err.error);
          }
        );
      }
    );
  }

}
