import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Data, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {
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
