import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

export class Concept {
  id:string;
  name:string;
  label:string;
  description:string;
}

@Injectable()
export class ConceptService {

  private headers: Headers;

  constructor(private http:Http, @Inject(API_BASE_HREF) private api:string) {
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer  ' + JSON.parse(localStorage.getItem('jwt')).access_token);
    this.headers.append('Content-Type', 'application/json');
  }


  static logError(err:string) {
    console.log('ConceptService: ', err);
  }

  save(concept: Concept) : any {
    return this.http.post(this.api + 'concept/create',
      JSON.stringify(concept),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

  getAll() : any {
    return this.http.get(this.api + 'concept/list',
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }
}
