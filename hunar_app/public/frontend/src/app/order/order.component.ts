import { Component, OnInit } from '@angular/core';
import { OrderNavService } from '../shared/services/order-nav.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private orderNav: OrderNavService) { }

  ngOnInit() {
  }

}
