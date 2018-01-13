import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { TOKEN_NAME } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {
    console.info('TokenInterceptor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(TOKEN_NAME) || '';

    // const authReq = request.clone({setHeaders: {Authorization: 'Bearer  ' + token}});
    if(token) {
      const newheader = new HttpHeaders().set('Authorization', 'Bearer ' + token)
        .append('Access-Control-Allow-Origin','*');
      const authReq = request.clone({ headers: newheader });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}
