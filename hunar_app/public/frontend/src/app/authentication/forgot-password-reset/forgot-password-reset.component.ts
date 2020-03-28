import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-forgot-password-reset',
  templateUrl: './forgot-password-reset.component.html',
  styleUrls: ['./forgot-password-reset.component.css']
})
export class ForgotPasswordResetComponent implements OnInit {
  password;
  cpassword;
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  success = false;
  failed = false;
  message: string;
  token;

  constructor(private authService: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.authService.resetPassword(f.value, this.token).subscribe(
        (res) => {
          console.log(res);
          this.message = res['message'];
          this.success = true;
        },
        (err) => {
          console.log(err);
          this.failed = true;
          this.message = err.error.message;
        }
      );
    } else {
      console.log('form invalid');
    }
  }

}
