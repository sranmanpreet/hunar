import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStorageService } from 'src/app/shared/data-storage.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdvertisementsResolver {
    constructor(
        private dataService: DataStorageService) { }

    resolve(): Observable<any> {
        return this.dataService.getAdvertisements().pipe(map((requests) => {
            return requests;
        }));
    }
}
