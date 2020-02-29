import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  windowScrolled: boolean;

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngOnInit() {

  }

  gotoTop() {
    this.document.body.scrollTop = this.document.documentElement.scrollTop = 0;
  }

}
