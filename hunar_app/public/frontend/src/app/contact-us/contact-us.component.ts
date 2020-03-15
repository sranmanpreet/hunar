import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AddressService } from '../shared/address.service';
import { ShoppingCartService } from '../shared/shopping-cart.service';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
  // emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  nameRegex = /^[ a-zA-Z_]{0,30}$/;
  messageRegex = /^[\n .,@:0-9a-zA-Z_]{0,400}$/;
  name: string;
  email: string;
  message: string;
  response;
  error: string;

  constructor(private dataService: DataStorageService, private authService: AuthService) { }

  ngOnInit() {
  }

  trimming_fn(x) {
    return x ? x.replace(/^\s+|\s+$/gm, '') : '';
  }

  onSend(form: NgForm) {
    if (form.valid) {
      const value = form.value;
      if (value.name) {
        value.name = this.trimming_fn(value.name);
        value.message = this.trimming_fn(value.message);
      }
      this.dataService.createContactUsEntry(value).subscribe((response) => {
        this.response = response;
      }, (err) => {
        this.error = err;
      });
    }
  }

  resetForm(form: NgForm) {
    form.reset();
  }
}
