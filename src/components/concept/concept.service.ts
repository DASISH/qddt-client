import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';

export class Concept {
  id:string;
  name:string;
  label:string;
  description:string;
  authors:any[];
  questionItems:any[];
}

@Injectable()
export class ConceptService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(concept: Concept, topicId: string) : any {
    return this.post(concept, 'concept/create/by-topicgroup/'+ topicId);
  }

  deleteConcept(conceptId: string) : any {
    return this.post({id: conceptId}, 'concept/delete/'+ conceptId);
  }

  updateConcept(concept: Concept) : any {
    return this.post(concept, 'concept');
  }

  getAll() : any {
    return this.get('concept/page');
  }

  getByTopic(topicId: string) : any {
    return this.get('concept/page/by-topicgroup/'+ topicId + '?page=0&size=50&sort=asc');
  }

  getByConcept(conceptId: string) : any {
    return this.get('concept/page/by-parent/'+ conceptId + '?page=0&size=50&sort=asc');
  }

  saveChildConcept(concept: any, parentId: string):any {
    return this.post(concept, 'concept/create/by-parent/'+ parentId);
  }

  attachQuestion(conceptId: string, questionId: string):any {
    return this.get('concept/combine?questionitem='+ questionId+ '&concept='+ conceptId);
  }

  deattachQuestion(conceptId: string, questionId: string):any {
    return this.get('concept/decombine?questionitem='+ questionId+ '&concept='+ conceptId);
  }

  attachAuthor(conceptId: string, authorId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&conceptId=' +conceptId);
  }

  deattachAuthor(conceptId: string, authorId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&conceptId=' +conceptId);
  }

  getQuestionItems(): any {
    let headers = new Headers();
    headers.append('Authorization', 'Bearer  ' + JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.get(this.api+'questionitem/page',
      {
        headers: headers
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

  createQuestionItem(question: any): any {
    return this.post(question,'questionitem/create');
  }
}
