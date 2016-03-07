//import {Injectable} from '../../../node_modules/angular2/core.d';
//import {Http, Headers, Response} from '../../../node_modules/angular2/http.d';
//import DateTimeFormat = Intl.DateTimeFormat;
//
//
//export class ResponseDomain {
//  id: string;
//  name: string;
//  modified:DateTimeFormat;
//}
//
//
//@Injectable()
//export class ResponseDomainService {
//
//  private responsedomain:ResponseDomain;
//  private headers: Headers;
//
//
//  constructor(private http: Http) {
//    this.headers = new Headers();
//    this.headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
//    this.headers.append('Content-Type', 'application/json');
//  }
//
//  save(entity:ResponseDomain):ResponseDomain {
//    this.responsedomain = entity;
//
//
//    this.http.post('http://nsd349.nsd.lan:8080/responsedomain/save',
//      JSON.stringify(this.responsedomain),
//      {
//        headers: this.headers
//      })
//      .map((res:Response) => res.json())
//      .subscribe(
//        (data:ResponseDomain) => {
//          this.responsedomain = data;
//          //this.responsedomain.push(this.responsedomain);
//        },
//        err => console.log('Unable to save Question.')
//      );
//
//    return this.responsedomain;
//  }
//}
