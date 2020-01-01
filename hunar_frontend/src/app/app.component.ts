import { Component, OnInit } from '@angular/core';
import { HeaderService } from './shared/header.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Hunar';
  showSpacer: boolean;
  /*   private lastPoppedUrl: string;
    private yScrollStack: number[] = []; */

  constructor(
    private headerService: HeaderService,
    private router: Router/* ,
    private location: Location */) {
    this.showSpacer = false;
  }

  ngOnInit() {
    this.headerService.showHeader = true;
    /*    this.location.subscribe((ev: PopStateEvent) => {
         this.lastPoppedUrl = ev.url;
       }); */
    this.router.events.subscribe((ev: any) => {
      if (this.router.url === '/') {
        this.showSpacer = false;
      } else {
        this.showSpacer = true;
      }
      if (!(ev instanceof NavigationEnd)) {
        return;
      }
      document.body.scrollTop = 0;
      /*  if (ev instanceof NavigationStart) {
         if (ev.url !== this.lastPoppedUrl) {
           this.yScrollStack.push(window.scrollY);
         }
       } else if (ev instanceof NavigationEnd) {
         if (ev.url === this.lastPoppedUrl) {
           this.lastPoppedUrl = undefined;
           window.scrollTo(0, this.yScrollStack.pop());
         } else {
           window.scrollTo(0, 0);
         }
       } */
    });
  }
}
