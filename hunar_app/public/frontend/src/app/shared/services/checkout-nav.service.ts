import { Injectable } from '@angular/core';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutNavService {
  public showProgressBar = true;
  public showAddress = true;
  public showSummary: boolean;
  public showPayment: boolean;
  public progressValue = 0;

  constructor() { }
}
