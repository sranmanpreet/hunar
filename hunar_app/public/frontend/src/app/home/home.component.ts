import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { OrderNavService } from '../shared/order-nav.service';
import { Product } from '../shared/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  popularArts: Product[];
  clients = [
    '../../assets/images/client2.png',
    '../../assets/images/client1.png',
    '../../assets/images/client4.jpg',
    '../../assets/images/client5.png',
    '../../assets/images/client6.png',
    '../../assets/images/client2.png'
  ];

  constructor(
    private router: Router,
    private orderNavService: OrderNavService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data) => {
        this.popularArts = this.shuffleArray(data.products).slice(0, 8);
      }
    );
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  goToAdvertise() {
    this.router.navigateByUrl('/order/advertise');
    this.orderNavService.showAdvertise = true;
    this.orderNavService.showGallery = false;
    this.orderNavService.showMakeToOrder = false;
  }

  goToOrder() {
    this.router.navigateByUrl('/order/exclusive-arts');
    this.orderNavService.showAdvertise = false;
    this.orderNavService.showGallery = false;
    this.orderNavService.showMakeToOrder = true;
  }

  goToGallery() {
    this.router.navigateByUrl('/order/gallery-of-art');
    this.orderNavService.showAdvertise = false;
    this.orderNavService.showGallery = false;
    this.orderNavService.showMakeToOrder = true;
  }
  
  goToArt(popularArt) {
    this.router.navigateByUrl('/order/gallery-of-art/' + popularArt._id);
  }

}
