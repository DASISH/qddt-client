import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

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
    return this.http.post(this.api+'category/create/',
      JSON.stringify(category),
      {
        headers: this.headers
      })
      .map((res: Response) => {
        return res.json();
      });
  }

  edit(category: Category): any {
    return this.http.post(this.api + 'category/',
      JSON.stringify(category),
      {
        headers: this.headers
      })
      .map((res: Response) => {
        return res.json();
      });
  }

  getAll(): any {
    return this.http.get(this.api+'category/page/search/' + '?level=ENTITY',
      {
        headers: this.headers
      })
      .map((res: Response) => {
        return res.json();
      });
  }

}
