import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-advertisements',
  templateUrl: './advertisements.component.html',
  styleUrls: ['./advertisements.component.css']
})
export class AdvertisementsComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private requests;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.route.data.subscribe(
      (data: Data) => {
        this.requests = data.requests;
        if (this.requests) {
          this.sortBy('createdDate');
        }
      }
    );
  }

  sortBy(field: string) {
    this.requests.sort((a: any, b: any) => {
      if (a[field] < b[field]) {
        return 1;
      } else if (a[field] > b[field]) {
        return -1;
      } else {
        return 0;
      }
    });
    this.requests = this.requests;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}