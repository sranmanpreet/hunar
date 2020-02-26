import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PricingService {


  constructor(private dataService: DataStorageService) { }

}
