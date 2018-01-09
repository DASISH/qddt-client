import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TOKEN_NAME } from './auth.service';

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('JWTInterceptor');
    req = req.clone({
      setHeaders: {
        authorization: localStorage.getItem(TOKEN_NAME)
      }
    });

    return next.handle(req);
  }
}
