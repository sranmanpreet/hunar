import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Address } from './address.model';
import { environment } from 'src/environments/environment';
import { User } from './user.model';
import { Product } from './product.model';
import { Price } from './prices.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient) { }

  postUpdatedUserProfile(user: User) {
    return this.http.post(environment.apiBaseUrl + '/user/updateProfile', user);
  }

  postUpdatedUserPassword(user: User) {
    return this.http.post(environment.apiBaseUrl + '/user/updatePassword', user);
  }

  sendOTPForPasswordRetrieval(data) {
    return this.http.post(environment.apiBaseUrl + '/user/forgot-password', data);
  }

  resetPassword(data, token) {
    //    return this.http.post(environment.apiBaseUrl + '/user/reset-password?token=' + token, data);
  }

  // administration

  fetchAllProducts() {
    return this.http.get(environment.apiBaseUrl + '/all-products');
  }

  addProduct(product: Product) {

  }

  addPricing(productId: String, newPrice: Price) {
    return this.http.put(environment.apiBaseUrl + '/product/' + productId + '/pricing/add', newPrice);
  }

  updatePricing(productId: String, updatedPricing: Price, pricingId: String) {
    return this.http.put(environment.apiBaseUrl + '/product/' + productId + '/pricing/update/' + pricingId, updatedPricing);
  }

  removePricing(productId: String, pricingId: String) {
    return this.http.delete(environment.apiBaseUrl + '/product/' + productId + '/pricing/' + pricingId);
  }


  fetchGalleryImages() {
    return this.http.get(environment.apiBaseUrl + '/products');
  }


  fetchGalleryImage(itemId) {
    return this.http.get(environment.apiBaseUrl + '/product/' + itemId);
  }

  addCartItem(item) {
    return this.http.post(environment.apiBaseUrl + '/add-to-cart', item);
  }

  removeCartItem(item) {
    return this.http.delete(environment.apiBaseUrl + '/cart/cart-item/' + item._id);
  }

  updateCartItemQty(item) {
    return this.http.post(environment.apiBaseUrl + '/update-cart/', item);
  }

  saveAddress(address: Address) {
    return this.http.post(environment.apiBaseUrl + '/address/add', address);
  }

  fetchCountries(): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/address/countries');
  }

  fetchStates(country): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/address/countries/' + country.id + '/states');
  }

  fetchCities(country, state): Observable<any> {
    return this.http.get(environment.apiBaseUrl + '/address/countries/' + country.id + '/states/' + state.id + '/cities');
  }

  fetchAddress(): Observable<Address[]> {
    return this.http.get<Address[]>(environment.apiBaseUrl + '/address/get');
  }
  deleteAddress(address) {
    return this.http.delete(environment.apiBaseUrl + '/address/delete/' + address._id);
  }

  getOrders() {
    return this.http.get(environment.apiBaseUrl + '/orders');
  }

  getOrder(order) {
    return this.http.post(environment.apiBaseUrl + '/order/get', order);
  }

  createOrder(order) {
    return this.http.post(environment.apiBaseUrl + '/order/create', order);
  }

  createContactUsEntry(formDetails) {
    return this.http.post(environment.apiBaseUrl + '/support/create', formDetails);
  }

  getSupportRequests() {
    return this.http.get(environment.apiBaseUrl + '/support/requests');
  }

  createAdvertisementEntry(formDetails) {
    return this.http.post(environment.apiBaseUrl + '/order/advertise', formDetails);
  }

  getAdvertisements() {
    return this.http.get(environment.apiBaseUrl + '/order/advertisements');
  }

  createFeedbackEntry(formDetails) {
    return this.http.post(environment.apiBaseUrl + '/feedback/create', formDetails);
  }

  getFeedbacks() {
    return this.http.get(environment.apiBaseUrl + '/feedbacks');
  }
}
