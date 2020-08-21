import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class XsrfInterceptor implements HttpInterceptor {

    constructor(private cookieService: CookieService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let requestToForward = req;
        let token = this.cookieService.get('XSRF-TOKEN') as string;
        if (token !== null) {
            requestToForward = req.clone({ setHeaders: { "X-XSRF-TOKEN": token } });
        }
        return next.handle(requestToForward);
    }
}
