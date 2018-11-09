import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TOKEN_NAME } from '../classes';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {
    console.log('TokenInterceptor');
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(TOKEN_NAME) || '';

    // const authReq = request.clone({setHeaders: {Authorization: 'Bearer  ' + token}});
    if (token) {
      const newheader = new HttpHeaders().set('Authorization', 'Bearer ' + token)
        .append('Access-Control-Allow-Origin', '*')
        .append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      const authReq = request.clone({ headers: newheader });
      return next.handle(authReq);
    }
    return next.handle(request);
  }
}
