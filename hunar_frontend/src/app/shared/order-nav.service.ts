import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderNavService {
  public showMakeToOrder = true;
  public showGallery: boolean;
  public showAdvertise: boolean;

  constructor() { }
}
