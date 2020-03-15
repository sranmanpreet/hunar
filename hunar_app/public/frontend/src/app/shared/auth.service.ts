import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { DataStorageService } from './data-storage.service';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  selectedUser: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  forgotPasswordResponse = new Subject();

  passwordResetResponse = new Subject();

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient, private dataService: DataStorageService, private cookieService: CookieService) { }

  // Http methods

  register(user: User) {
    return this.http.post(environment.apiBaseUrl + '/user/register', user, this.noAuthHeader);
  }

  login(authCredentitals) {
    return this.http.post(environment.apiBaseUrl + '/user/login', authCredentitals, this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/user/profile');
  }

  updateUserProfile(user: User) {
    return this.dataService.postUpdatedUserProfile(user);
  }

  updateUserPassword(user: User) {
    return this.http.post(environment.apiBaseUrl + '/user/updatePassword', user);
  }

  forgotPassword(data) {
    this.dataService.sendOTPForPasswordRetrieval(data).subscribe(
      (res) => {
        this.forgotPasswordResponse.next(res['status']);
      },
      (err) => {
        this.forgotPasswordResponse.next(err['status']);
      }
    );
  }

  resetPassword(data, token) {
    return this.http.post(environment.apiBaseUrl + '/user/reset-password/' + token, data, this.noAuthHeader);
  }

  // Helper methods

  setToken(token) {
    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() + 30);
    return this.cookieService.set('hunarToken', token, expiredDate);
  }

  getToken() {
    return this.cookieService.get('hunarToken');
  }

  logout() {
    this.cookieService.deleteAll();
    return this.http.get(environment.apiBaseUrl + '/user/logout');
  }

  getUserPayload() {
    const token = this.cookieService.get('hunarToken');
    if (token) {
      const userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    } else {
      return null;
    }
  }

  isLoggedIn() {
    const userPayload = this.getUserPayload();
    if (userPayload) {
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

}
