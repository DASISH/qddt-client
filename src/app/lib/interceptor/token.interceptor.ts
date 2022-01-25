import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TokenStorageService } from '../services/token-storage.service';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private token: TokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // const token = localStorage.getItem(TOKEN_NAME)
    let authReq = req
    const token = this.token.getToken();
    if (token != null) {
      authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token)
          .append('Access-Control-Allow-Origin', '*')
          .append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
          .append('Content-Type',  'application/json; charset=UTF-8')
      })
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
]

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem(TOKEN_NAME) || '';

//     // const authReq = request.clone({setHeaders: {Authorization: 'Bearer  ' + token}});
//     if (token) {
//       const newheader = new HttpHeaders().set('Authorization', 'Bearer ' + token)
//         .append('Access-Control-Allow-Origin', '*')
//         .append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//       const authReq = request.clone({ headers: newheader });
//       return next.handle(authReq);
//     }
//     return next.handle(request);
//   }
// }
