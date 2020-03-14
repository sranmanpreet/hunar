import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PricingService {


  constructor(private http: HttpClient) { }

  public getArtTypes(){
    return this.http.get(environment.apiBaseUrl + '/metadata/arttypes');
  }

  public getArtSizes(){
    return this.http.get(environment.apiBaseUrl + '/metadata/artsizes');
  }

}
