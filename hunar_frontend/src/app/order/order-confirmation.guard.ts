import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CanActivate } from '@angular/router/src/utils/preactivation';
import { OrderService } from '../shared/order.service';

@Injectable({
    providedIn: 'root'
})
export class OrderConfirmationGuard implements CanActivate {
    path: ActivatedRouteSnapshot[];
    route: ActivatedRouteSnapshot;
    constructor(private router: Router, private orderService: OrderService) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        if (!this.orderService.showConfirmation) {
            this.router.navigateByUrl('/my-orders');
            return false;
        } else {
            return true;
        }
    }
}
