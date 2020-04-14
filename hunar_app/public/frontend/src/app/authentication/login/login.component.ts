import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { NgForm } from '@angular/forms';
import { HeaderService } from 'src/app/shared/services/header.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  model = {
    email: '',
    password: ''
  };
  emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;
  //  emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  serverErrorMessages: string;
  prevPage: string;

  constructor(
    private authService: AuthService,
    private headerService: HeaderService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService) { }

  ngOnInit() {
    this.headerService.showHeader = false;
    this.route.queryParams.subscribe(params => {
      this.prevPage = params.page;
    });
  }

  onSignIn(form: NgForm) {
    this.authService.login(form.value).subscribe(
      (res) => {
        if (this.prevPage === 'checkout-address') {
          this.router.navigate(['/checkout/address']);
        } else {
          this.router.navigateByUrl('/gallery-of-art');
        }
      },
      (err) => {
        this.serverErrorMessages = err.error.message;
      }
    );
  }

  onSignInViaGoogle(){
    this.authService.loginViaGoogle().subscribe(
      (res) => {
        if (this.prevPage === 'checkout-address') {
          this.router.navigate(['/checkout/address']);
        } else {
          this.router.navigateByUrl('/gallery-of-art');
        }
      },
      (err) => {
        this.serverErrorMessages = err.error.message;
      }
    );
  }

  ngOnDestroy() {
    this.headerService.showHeader = true;
  }

}
