import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

export interface ArtTypes {
  name: string;
}
export interface ArtSizes {
  value: string;
}

@Component({
  selector: 'app-make-to-order',
  templateUrl: './make-to-order.component.html',
  styleUrls: ['./make-to-order.component.css']
})
export class MakeToOrderComponent implements OnInit {
  defaultImage = '../../../assets/images/footer-fb.png';
  image: any;
  showDate: false;
  expectedDeliveryDate: Date;
  photo = false;
  artTypes: ArtTypes[] = [
    { name: 'Digital' },
    { name: 'Water Colors' },
    { name: 'Miniature' },
    { name: 'Charcoal' }
  ];
  artSizes: ArtSizes[] = [
    { value: 'A4' },
    { value: 'A3' },
    { value: 'A2' },
    { value: 'A1' }
  ];
  minDate = new Date();
  maxDate = new Date(this.minDate.getFullYear() + 1, 0, 0);
  selectedArtType: string;
  selectedArtSize: string;
  instructions: string;

  constructor() { }

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

  onContinue(f: NgForm) {
    if(f.valid){
      console.log(f.value);
    } else {
      console.log("Invalid data");
    }
  }

}
