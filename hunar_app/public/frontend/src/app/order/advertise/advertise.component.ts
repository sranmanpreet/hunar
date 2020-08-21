import { Component, OnInit } from '@angular/core';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.component.html',
  styleUrls: ['./advertise.component.css']
})
export class AdvertiseComponent implements OnInit {
  emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
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
      this.dataService.createAdvertisementEntry(value).subscribe((response) => {
        this.response = response;
      }, (err) => {
        this.error = err.error.message;
      });
    }
  }

  resetForm(form: NgForm) {
    form.reset();
  }

}
