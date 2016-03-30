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

  save(concept: Concept, topicId: string) : any {
    return this.http.post(this.api + 'concept/create/by-topicgroup/'+ topicId,
      JSON.stringify(concept),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

  getAll() : any {
    return this.http.get(this.api + 'concept/page',
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

  getByTopic(topicId:string) : any {
    return this.http.get(this.api + 'concept/page/by-topicgroup/'+ topicId + '?page=0&size=20&sort=asc',
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

  saveChildConcept(concept: any, parentId: string):any {
    return this.http.post(this.api + 'concept/create/by-parent/'+ parentId,
      JSON.stringify(concept),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }
}
