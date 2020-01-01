import { Component, OnInit } from '@angular/core';

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
  date: Date;
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
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2020, 0, 1);
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
}
