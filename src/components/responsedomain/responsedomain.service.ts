import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {API_BASE_HREF} from '../../api';
import * as Rx from 'rxjs/Rx';
import {Category} from '../category/category.service';

export class ResponseDomain {
  id: string;
  name: string;
  label: string;
  description: string;
  responseKind: string;
  managedRepresentation: Category;
}

@Injectable()
export class ResponseDomainService {

  private headers: Headers;

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.headers.append('Content-Type', 'application/json');
  }

  create(responseDomain: ResponseDomain): any {
    return this.post(responseDomain,'responsedomain/create');
  }

  update(responseDomain: ResponseDomain): any {
    return this.post(responseDomain,'responsedomain/');
  }

  getAll(domain: string): any {
    return this.get('responsedomain/page/search?ResponseKind=' + domain);
  }

  private handleError(error: Response) {
    console.log(error);

    return  Rx.Observable.throw(error.json().exceptionMessage|| 'Server error');
  }

  private get(url: String) : any {
    return this.http.get(this.api + url,
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  private post(responseDomain: ResponseDomain, url: String): any {
    return this.http.post(this.api + url,
      JSON.stringify(responseDomain),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }
}
