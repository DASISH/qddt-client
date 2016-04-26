import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import * as Rx from 'rxjs/Rx';

export class Concept {
  id:string;
  name:string;
  label:string;
  description:string;
  authors:any[];
  questions:any[];
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
    return this.post(concept, 'concept/create/by-topicgroup/'+ topicId);
  }

  updateConcept(concept: Concept) : any {
    return this.post(concept, 'concept');
  }

  getAll() : any {
    return this.get('concept/page');
  }

  getByTopic(topicId: string) : any {
    return this.get('concept/page/by-topicgroup/'+ topicId + '?page=0&size=20&sort=asc');
  }

  getByConcept(conceptId: string) : any {
    return this.get('concept/page/by-parent/'+ conceptId + '?page=0&size=20&sort=asc');
  }

  saveChildConcept(concept: any, parentId: string):any {
    return this.post(concept, 'concept/create/by-parent/'+ parentId);
  }

  attachQuestion(conceptId: string, questionId: string):any {
    return this.get('concept/combine?question='+ questionId+ '&concept='+ conceptId);
  }

  deattachQuestion(conceptId: string, questionId: string):any {
    return this.get('concept/decombine?question='+ questionId+ '&concept='+ conceptId);
  }

  attachAuthor(conceptId: string, authorId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&conceptId=' +conceptId);
  }

  deattachAuthor(conceptId: string, authorId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&conceptId=' +conceptId);
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

  private post(concept: any, url: String):any {
    return this.http.post(this.api + url,
      JSON.stringify(concept),
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

}
