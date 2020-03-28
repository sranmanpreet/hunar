import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStorageService } from 'src/app/shared/services/data-storage.service';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FeedbackResolver {
    constructor(
        private dataService: DataStorageService) { }

    resolve(): Observable<any> {
        return this.dataService.getFeedbacks().pipe(map((requests) => {
            return requests;
        }));
    }
}
