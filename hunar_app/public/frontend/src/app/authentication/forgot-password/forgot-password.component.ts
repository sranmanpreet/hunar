import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  email: string;

  emailRegex = /^[._0-9a-zA-Z_]+@[a-zA-Z_]+?\.[.a-zA-Z]{2,6}$/;

  success = false;
  message;
  showSpinner = false;
  subscription: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.authService.forgotPassword(f.value);
      this.showSpinner = true;
      this.subscription = this.authService.forgotPasswordResponse.subscribe(
        (res) => {
          if (res === 200) {
            this.success = true;
            this.message = 'Please check your inbox ' + this.email;
          } else if (res === 404) {
            this.success = false;
            this.message = this.email + ' is not a registered user.';
            setTimeout(() => {
              this.message = '';
            }, 5000);
          } else {
            this.success = false;
            this.message = 'Something went wrong. Please try again later.';
          }
          this.showSpinner = false;
        }
      );
    } else {
      console.log('Invalid form');
    }
  }


  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
