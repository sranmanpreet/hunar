import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AddressService } from '../shared/address.service';
import { CookieService } from 'ngx-cookie-service';

interface UserDetails {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  generalBlock = true;
  addressBlock: boolean;
  passwordBlock: boolean;
  emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  nameRegex = /^[a-zA-Z_]{0,30}$/;
  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
  showSuccessMessage: string;
  userDetails;
  password = 's';
  cpassword = 's';
  addresses;
  show = false;
  serverErrorMessages: string;
  constructor(
    private authService: AuthService,
    private addressService: AddressService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.showSuccessMessage = '';
    this.route.data.subscribe(
      (data) => {
        if (data.addresses) {
          this.addressService.addresses = data.addresses;
        } else if (!this.authService.isLoggedIn() && this.cookieService.check('hunarSelectedAddress')) {
          this.addressService.addresses = [JSON.parse(this.cookieService.get('hunarSelectedAddress'))];
        }
      }
    );
    this.authService.getUserProfile().subscribe(
      (res: UserDetails) => {
        this.userDetails = res.user;
      },
      err => {
        console.log(err);
      }
    );
  }


  onClickGeneral() {
    this.showSuccessMessage = '';
    this.generalBlock = true;
    this.addressBlock = false;
    this.passwordBlock = false;
  }
  onClickSavedAddresses() {
    this.showSuccessMessage = '';
    this.generalBlock = false;
    this.addressBlock = true;
    this.passwordBlock = false;
  }
  onClickChangePassword() {
    this.showSuccessMessage = '';
    this.generalBlock = false;
    this.addressBlock = false;
    this.passwordBlock = true;
  }

  onSaveGeneral(form: NgForm) {
    if (form.valid) {
      this.authService.updateUserProfile(form.value).subscribe(
        (res) => {
          this.authService.getUserProfile().subscribe(
            (res: UserDetails) => {
              this.userDetails = res.user;
              this.showSuccessMessage = 'Profile updated';
              setTimeout(() => {
                this.showSuccessMessage = '';
              }, 3000);
            },
            err => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
          this.showSuccessMessage = err.error.message;
          setTimeout(() => {
            this.showSuccessMessage = '';
          }, 3000);
        }
      );
    }

  }

  resetProfileGeneral() {
    this.authService.getUserProfile().subscribe(
      (res: UserDetails) => {
        this.userDetails = res.user;
      },
      err => {
        console.log(err);
      }
    );
  }

  onDeleteAddress(address) {
    this.addressService.deleteAddress(address);
  }

  onUpdatePassword(form: NgForm) {
    if (form.valid) {
      this.authService.updateUserPassword(form.value).subscribe(
        (res) => {
          this.showSuccessMessage = 'Password updated';
        },
        (err) => {
          console.log(err['message']);
        }
      );
      setTimeout(() => {
        this.showSuccessMessage = '';
      }, 3000);
    }
  }

  showPassword() {
    this.show = !this.show;
  }

  onLogout() {
    this.authService.logout().subscribe(response => {
      console.log(response);
    });
    this.router.navigateByUrl('/sign-in');
  }

}
