import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { QuestionItem } from '../../question/question.service';
import { Observable } from 'rxjs/Observable';
import {VersionComponent} from '../../shared/version/version.component';
import {ElementKind, ElementRef} from '../../preview/preview.service';


export class Concept {
  id: string;
  name: string;
  label: string;
  description: string;
  authors: any[];
  conceptQuestionItems: ElementRef[];
  children: Concept[];
  comments: any[];
}

@Injectable()
export class ConceptService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  getConcept(conceptId: string): Promise<any> {
    return this.http.get(this.api + 'concept/' + conceptId).toPromise();
  }

  getAll(): Promise<any> {
    return this.http.get(this.api + 'concept/page/').toPromise();
  }

  getByTopic(topicId: string): Promise<any> {
    return this.http.get(this.api + 'concept/page/by-topicgroup/' + topicId + '?page=0&size=50&sort=asc')
      .toPromise();
  }

  getByConcept(conceptId: string): Promise<any> {
    return this.http.get(this.api + 'concept/page/by-parent/' + conceptId + '?page=0&size=50&sort=asc')
      .toPromise();
  }

  getPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'concept/pdf/' + id, {responseType: 'blob'})
      .toPromise();
  }

  save(concept: Concept, topicId: string): Observable<any> {
    return this.http.post(this.api + 'concept/create/by-topicgroup/' + topicId, concept);
  }

  updateConcept(concept: Concept): Observable<any> {
    return this.http.post(this.api + 'concept', concept);
  }

  saveChildConcept(concept: any, parentId: string): Observable<any> {
    return this.http.post(this.api + 'concept/create/by-parent/' + parentId, concept);
  }

  attachQuestion(conceptId: string, questionId: string, revision: string): Observable<any> {
    if (revision === null) {
      revision = '0';
    }
    return this.http.post(this.api + 'concept/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&conceptid=' + conceptId, {});
  }

  deattachQuestion(conceptId: string, questionId: string, revision: string): Observable<any> {
    return this.http.post(this.api + 'concept/decombine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&conceptid=' + conceptId, {});
  }

  attachAuthor(conceptId: string, authorId: string): Observable<any> {
    return this.http.post(this.api + 'author/combine?authorId=' + authorId +
      '&conceptId=' + conceptId, {});
  }

  deattachAuthor(conceptId: string, authorId: string): Observable<any> {
    return this.http.delete(this.api + 'author/decombine?authorId=' + authorId + '&conceptId=' + conceptId);
  }

  createQuestionItem(question: any): Observable<any> {
    return this.http.post(this.api + question, 'questionitem/create');
  }

  deleteConcept(conceptId: string): Observable<any> {
    return this.http.delete(this.api + 'concept/delete/' + conceptId , { responseType: 'text'});
  }

}
