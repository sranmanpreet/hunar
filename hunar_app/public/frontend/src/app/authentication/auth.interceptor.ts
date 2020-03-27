import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (req.headers.get('noauth')) {
            return next.handle(req.clone({ withCredentials: true }));
        } else {
            const clonedreq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + this.authService.getToken()),
                withCredentials: true
            });
            return next.handle(clonedreq).pipe(
                tap(
                    event => { },
                    (err: any) => {
                        if (err instanceof HttpErrorResponse) {
                            if (err.status == 401) {
                                this.router.navigateByUrl('/sign-in');
                            }
                            else if (err.status == 403) {
                                this.router.navigateByUrl('/unauthorized');
                            } else {
                                return;
                            }
                        }
                    }
                )
            );
        }
    }
}
