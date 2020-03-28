import { Component, OnInit } from '@angular/core';
import { PricingService } from 'src/app/shared/services/pricing.service';
import { NgForm } from '@angular/forms';
import { ArtType } from 'src/app/shared/models/art-type.model';
import { ArtSize } from 'src/app/shared/models/art-size.model';

@Component({
  selector: 'app-art-type-size',
  templateUrl: './art-type-size.component.html',
  styleUrls: ['./art-type-size.component.css']
})
export class ArtTypeSizeComponent implements OnInit {
  artTypes: ArtType[];
  message: string;

  nameRegex = /^[a-zA-Z0-9 ]{1,30}$/;
  artSizes: ArtSize[];

  constructor(private pricingService: PricingService) { }

  ngOnInit(){
    this.pricingService.getArtTypes().subscribe(
      (artTypes: ArtType[]) => {
        this.artTypes = artTypes;
      },
      (err) => {
        console.log(err.error);
      }
    );

    this.pricingService.getArtSizes().subscribe(
      (artSizes: ArtSize[]) => {
        this.artSizes = artSizes;
      },
      (err) => {
        console.log(err.error);
      }
    );
  }

  addArtType(f: NgForm){
    if(f.valid){
      this.pricingService.addArtType({value: f.value.artType}).subscribe(
        () => {
          this.pricingService.getArtTypes().subscribe(
            (artTypes: ArtType[]) => {
              this.artTypes = artTypes;
              f.reset();
            },
            (err) => {
              console.log(err.error);
            }
          );
        },
        (err) => {
          console.log(err.error);
        }
      );
    }
  }

  deleteArtType(artTypeId){
    this.pricingService.deleteArtType(artTypeId).subscribe(
      ()=>{
        this.pricingService.getArtTypes().subscribe(
          (artTypes: ArtType[]) => {
            this.artTypes = artTypes;
          },
          (err) => {
            console.log(err.error);
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
            (artSizes: ArtSize[]) => {
              this.artSizes = artSizes;
              f.reset();
            },
            (err) => {
              console.log(err.error);
            }
          );
        },
        (err) => {
          console.log(err.error);
        }
      );
    }
  }

  deleteArtSize(artSizeId){
    this.pricingService.deleteArtSize(artSizeId).subscribe(
      ()=>{
        this.pricingService.getArtSizes().subscribe(
          (artSizes: ArtSize[]) => {
            this.artSizes = artSizes;
          },
          (err) => {
            console.log(err.error);
          }
        );
      }
    );
  }

}
