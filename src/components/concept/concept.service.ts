import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import * as Rx from 'rxjs/Rx';
//import {Observable} from 'rxjs/Observable';

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
      })
      .catch(this.handleError);
  }

  updateConcept(concept: Concept) : any {
    return this.http.post(this.api + 'concept',
      JSON.stringify(concept),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getAll() : any {
    return this.http.get(this.api + 'concept/page',
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getByTopic(topicId: string) : any {
    return this.http.get(this.api + 'concept/page/by-topicgroup/'+ topicId + '?page=0&size=20&sort=asc',
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getByConcept(conceptId: string) : any {
    return this.http.get(this.api + 'concept/page/by-parent/'+ conceptId + '?page=0&size=20&sort=asc',
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  saveChildConcept(concept: any, parentId: string):any {
    return this.http.post(this.api + 'concept/create/by-parent/'+ parentId,
      JSON.stringify(concept),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }


  attachQuestion(conceptId: string, questionId: string):any {
    return this.http.get(this.api + 'concept/combine?question='+ questionId+ '&concept='+ conceptId,
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getQuestions(): any {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer  ' + JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.get(this.api+'question/page',
      {
        headers: headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }


  private handleError(error: Response) {
    console.log(error);

    return  Rx.Observable.throw(error.json().exceptionMessage|| 'Server error');
  }
}
