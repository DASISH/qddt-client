import { Observable } from 'rxjs/Observable';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ElementKind, QddtElement, QDDT_ELEMENTS, ElementRevisionRef } from '../shared/elementinterfaces/elements';
import {IEntityAudit, IEntityEditAudit, IVersion} from '../shared/elementinterfaces/entityaudit';

export class SurveyProgram implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  authors: any[];
  comments: any[];
  modified: any;
  archived: boolean;
  studies: Study[];
  classKind = ElementKind[ElementKind.SURVEY_PROGRAM];
  agency: IEntityAudit;
  basedOnObject: string;
  basedOnRevision: number;
  version: IVersion;
}

export class Study implements IEntityEditAudit {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  authors: any[];
  comments: any[];
  topicGroups: Topic[];
  classKind = ElementKind[ElementKind.STUDY];
  agency: IEntityAudit;
  basedOnObject: string;
  basedOnRevision: number;
  modified: number;
  version: IVersion;
}

export class Topic implements IEntityEditAudit {
  id: string;
  name: string;
  abstractDescription: string;
  archived: boolean;
  authors: any[];
  comments: any[];
  otherMaterials: any[];
  topicQuestionItems: ElementRevisionRef[];
  concepts: Concept[];
  classKind = ElementKind[ElementKind.TOPIC_GROUP];
  agency: IEntityAudit;
  basedOnObject: string;
  basedOnRevision: number;
  modified: number;
  version: IVersion;

}

export class Concept implements IEntityEditAudit {
  id: string;
  name: string;
  label: string;
  description: string;
  authors: any[];
  conceptQuestionItems: ElementRevisionRef[];
  children: Concept[];
  comments: any[];
  classKind = ElementKind[ElementKind.CONCEPT];
  agency: IEntityAudit;
  basedOnObject: string;
  basedOnRevision: number;
  modified: number;
  version: IVersion;
}


@Injectable()
export class HomeService {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) {
  }

  getRevisionById(elementTypeId: ElementKind, id: string): Promise<any> {
    const qe: QddtElement = QDDT_ELEMENTS.find(e => e.id === elementTypeId);
    if (qe !== undefined) {
      return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
    }
    return Observable.of([]).toPromise();
  }

  getElementByTypeAndName(elementTypeId: ElementKind, name: string): Promise<any> {
    const qe: QddtElement = QDDT_ELEMENTS.find(e => e.id === elementTypeId);
    if (qe !== undefined) {
      return this.http.get(this.api + qe.path + '/page/search/?name=*' + name + '*' ).toPromise();
    }
    return Observable.of([]).toPromise();

  }

  copySource(elementTypeId: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<any> {
    const qe: QddtElement = QDDT_ELEMENTS.find(e => e.id === elementTypeId);
    return this.http.post(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  getConcept(conceptId: string): Promise<any> {
    return this.http.get(this.api + 'concept/' + conceptId).toPromise();
  }


  getByTopic(topicId: string): Promise<any> {
    return this.http.get(this.api + 'concept/page/by-topicgroup/' + topicId + '?page=0&size=50&sort=asc')
      .toPromise();
  }

  getTopic(id: string): Promise<any> {
    return this.http.get(this.api + 'topicgroup/' + id).toPromise();
  }

  getAllTopic(studyId: string): Promise<any> {
    return this.http.get(this.api + 'topicgroup/list/by-study/' + studyId).toPromise();
  }

  getAllStudy(surveyProgramId: String): Promise<any> {
    return this.http.get(this.api + 'surveyprogram/' + surveyProgramId).toPromise();
  }

  getStudy(id: String): Promise<any> {
    return this.http.get(this.api + 'study/' + id).toPromise();
  }

  createSurvey(surveyProgram: SurveyProgram): Observable<any> {
    return this.http.post(this.api + 'surveyprogram/create', surveyProgram);
  }

  updateSurvey(surveyProgram: SurveyProgram):  Observable<any> {
    return this.http.post(this.api + 'surveyprogram/', surveyProgram);
  }

  deleteSurvey(surveyId: string): Observable<any> {
    return this.http.delete(this.api + 'surveyprogram/delete/' + surveyId);
  }

  getAllSurvey(): Promise<any> {
    return this.http.get(this.api + 'surveyprogram/list/by-user')
    .toPromise();
  }

  getSurveyPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'surveyprogram/pdf/' + id, {responseType: 'blob'})
    .toPromise();
  }

  createConcept(concept: Concept, topicId: string): Observable<any> {
    return this.http.post(this.api + 'concept/create/by-topicgroup/' + topicId, concept);
  }

  createChildConcept(concept: any, parentId: string): Observable<any> {
    return this.http.post(this.api + 'concept/create/by-parent/' + parentId, concept);
  }


  createTopic(topic: Topic, studyId: string): Observable<any> {
    return this.http.post(this.api + 'topicgroup/create/' + studyId, topic);
  }

  createStudy(study: Study, surveyProgramId: String): Observable<any>  {
    return this.http.post(this.api + 'study/create/' + surveyProgramId, study);
  }


  updateConcept(concept: Concept): Observable<any> {
    return this.http.post(this.api + 'concept', concept);
  }


  updateTopic(topic: Topic): Observable<any> {
    return this.http.post(this.api + 'topicgroup/', topic);
  }

  updateStudy(study: Study): Observable<any>  {
    return this.http.post(this.api + 'study/', study);
  }


  deleteConcept(conceptId: string): Observable<any> {
    return this.http.delete(this.api + 'concept/delete/' + conceptId , { responseType: 'text'});
  }

  deleteTopic(topicId: string): Observable<any> {
    return this.http.delete(this.api + 'topicgroup/delete/' + topicId);
  }

  deleteStudy(id: string): Observable<any>  {
    return this.http.delete(this.api + 'study/delete/' + id);
  }

  attachConceptQuestion(conceptId: string, questionId: string, revision: string): Observable<any> {
    if (revision === null) {
      revision = '0';
    }
    return this.http.post(this.api + 'concept/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&conceptid=' + conceptId, {});
  }

  attachTopicQuestion(topicId: string, questionId: string, revision: string): Observable<any> {
    if (revision === null) {
      revision = '0';
    }
    return this.http.post(this.api + 'topicgroup/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision + '&topicid=' + topicId, {});
  }


  deattachConceptQuestion(conceptId: string, questionId: string, revision: string): Observable<any> {
    return this.http.post(this.api + 'concept/decombine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&conceptid=' + conceptId, {});
  }

  deattachTopicQuestion(topicId: string, questionId: string): Observable<any> {
    return this.http.post(this.api + 'topicgroup/decombine?questionitemid=' + questionId + '&topicid=' + topicId, {});
  }

  attachAuthor(conceptId: string, authorId: string): Observable<any> {
    return this.http.post(this.api + 'author/combine?authorId=' + authorId +
      '&conceptId=' + conceptId, {});
  }

  deattachAuthor(conceptId: string, authorId: string): Observable<any> {
    return this.http.delete(this.api + 'author/decombine?authorId=' + authorId + '&conceptId=' + conceptId);
  }

  attachStudyAuthor(studyId: string, authorId: string): Observable<any> {
    return this.http.post(this.api + 'author/combine?authorId=' + authorId + '&studyId=' + studyId, {});
  }


  deattachStudyAuthor(studyId: string, authorId: string): Observable<any>  {
    return this.http.delete(this.api + 'author/decombine?authorId=' + authorId + '&studyId=' + studyId);
  }


  getConceptPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'concept/pdf/' + id, {responseType: 'blob'})
      .toPromise();
  }

  getTopicPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'topicgroup/pdf/' + id, { responseType: 'blob'})
      .toPromise();
  }

  getStudyPdf(id: string): Promise<any> {
    return this.http.get(this.api + 'study/pdf/' + id, { responseType: 'blob'})
      .toPromise();
  }


  getFile(id: string): Promise<any> {
    return this.http.get(this.api + 'othermaterial/files/' + id, { responseType: 'blob'})
      .toPromise();
  }

  deleteFile(id: string): Observable<any> {
    return this.http.delete(this.api + 'othermaterial/delete/' + id);
  }

  uploadFile(id: string, files: any): Observable<any> {
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id + '/T', formData)
      .map((res: any) => {
        try {
          return res;
        } catch (e) {
          return [];
        }
      });
  }


}
