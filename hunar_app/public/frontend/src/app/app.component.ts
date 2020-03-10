import { Component, OnInit } from '@angular/core';
import { HeaderService } from './shared/header.service';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import 'hammerjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Hunar';
  showSpacer: boolean;

  constructor(
    private headerService: HeaderService,
    private router: Router) {
    this.showSpacer = false;
  }

  ngOnInit() {
    this.headerService.showHeader = true;
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
    });
  }
}
