import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Price } from '../models/prices.model';

@Injectable({
  providedIn: 'root'
})
export class PricingService {


  constructor(private http: HttpClient) { }

  public getArtTypes() {
    return this.http.get(environment.apiBaseUrl + '/metadata/arttypes');
  }

  
  public addArtType(artType) {
    return this.http.post(environment.apiBaseUrl + '/metadata/arttype', artType);
  }

  public deleteArtType(artTypeId) {
    return this.http.delete(environment.apiBaseUrl + '/metadata/arttype/' + artTypeId);
  }
  
  public getArtSizes() {
    return this.http.get(environment.apiBaseUrl + '/metadata/artsizes');
  }
  
  public addArtSize(artSize) {
    return this.http.post(environment.apiBaseUrl + '/metadata/artsize', artSize);
  }
  
  public deleteArtSize(artSizeId) {
    return this.http.delete(environment.apiBaseUrl + '/metadata/artsize/' + artSizeId);
  }
  
  public getPricelist(){
    return this.http.get(environment.apiBaseUrl + '/metadata/pricelist');
  }
  
  public addPrice(price: Price){
    return this.http.post(environment.apiBaseUrl + '/metadata/pricelist', price);
  }
  
  public deletePrice(priceid: String){
    return this.http.delete(environment.apiBaseUrl + '/metadata/pricelist/' + priceid);
  }

}
