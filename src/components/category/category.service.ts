import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import * as Rx from 'rxjs/Rx';

export class Category {
  id: string;
  name: string;
  label: string;
  description: string;
}

@Injectable()
export class CategoryService {

  private headers: Headers;

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.headers.append('Content-Type', 'application/json');
  }

  static logError(err: string) {
    console.log('CategoryService: ', err);
  }

  save(category: Category): any {
    return this.post(category,'category/create/');
  }

  edit(category: Category): any {
    return this.post(category,'category/');
  }

  getAll(): any {
    return this.get('category/page/search/?level=ENTITY');
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

  private post(category: Category, url: String): any {
    return this.http.post(this.api + url,
      JSON.stringify(category),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }
}
