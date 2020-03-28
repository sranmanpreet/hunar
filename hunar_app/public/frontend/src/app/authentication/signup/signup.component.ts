import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { HeaderService } from 'src/app/shared/services/header.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService]
})
export class SignupComponent implements OnInit, OnDestroy {
  emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
  // emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  nameRegex = /^[ a-zA-Z_]{0,30}$/;
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  showSuccessMessage = '';
  serverErrorMessages: string;
  prevPage: string;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.headerService.showHeader = false;
    this.headerService.showHeader = false;
    this.route.queryParams.subscribe(params => {
      this.prevPage = params.page;
    });
  }

  trimming_fn(x) {
    return x ? x.replace(/^\s+|\s+$/gm, '') : '';
  }

  onSignUp(form: NgForm) {
    if (form.valid) {
      const value = form.value;
      value.firstName = this.trimming_fn(value.firstName);
      value.lastName = this.trimming_fn(value.lastName);
      value.email = this.trimming_fn(value.email);
      value.password = this.trimming_fn(value.password);
      this.authService.register(value).subscribe(
        (res) => {
          this.showSuccessMessage = res['message'];
          setTimeout(() => this.showSuccessMessage = '', 2000);
          if (this.prevPage === 'checkout-address') {
            this.router.navigate(['/checkout/address']);
          } else {
            this.router.navigateByUrl('/gallery-of-art');
          }
          // this.resetForm(form);
        },
        (err) => {
          this.serverErrorMessages = err.error.message.join('<br/>');
        }
      );
    }
  }

  resetForm(form: NgForm) {
    this.authService.selectedUser = {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    };
    form.resetForm();
    this.serverErrorMessages = '';
  }

  ngOnDestroy() {
    this.headerService.showHeader = true;
  }

}
