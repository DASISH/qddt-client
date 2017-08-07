import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { QuestionItem } from '../question/question.service';

export class ConceptQuestionItem {
  id:string;
  questionItem:QuestionItem;
  questionItemRevision:number;
  updated:Date;
}


export class Concept {
  id:string;
  name:string;
  label:string;
  description:string;
  authors:any[];
  conceptQuestionItems:ConceptQuestionItem[];
}

@Injectable()
export class ConceptService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(concept: Concept, topicId: string) : any {
    return this.post(concept, 'concept/create/by-topicgroup/'+ topicId);
  }

  getConcept(conceptId: string) : any {
    return this.get('concept/'+ conceptId);
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

  attachQuestion(conceptId: string, questionId: string, revision: string):any {
    if (revision===null)
      revision ='0';
    return this.get('concept/combine?questionitemid='+ questionId+ '&questionitemrevision=' + revision + '&conceptid='+ conceptId);
  }

  deattachQuestion(conceptId: string, questionId: string):any {
    return this.get('concept/decombine?questionitemid='+ questionId+ '&conceptid='+ conceptId);
  }

  attachAuthor(conceptId: string, authorId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&conceptId=' +conceptId);
  }

  deattachAuthor(conceptId: string, authorId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&conceptId=' +conceptId);
  }

  createQuestionItem(question: any): any {
    return this.post(question,'questionitem/create');
  }

  getPdf(id: string): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'concept/pdf/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }
}
