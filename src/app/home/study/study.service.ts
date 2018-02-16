import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { Observable } from 'rxjs/Observable';
import { Topic } from '../topic/topic.service';

export class Study {
  id: string;
  name: string;
  description: string;
  archived: boolean;
  authors: any[];
  comments: any[];
  topicGroups: Topic[];
}

@Injectable()
export class StudyService  {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) {
  }

  getAll(surveyProgramId: String): Promise<any> {
    return this.http.get(this.api + 'surveyprogram/' + surveyProgramId).toPromise();
  }

  getStudy(id: String): Promise<any> {
    return this.http.get(this.api + 'study/' + id).toPromise();
  }

  getPdf(id: string): Promise<any> {
    return this.http.get(this.api + 'study/pdf/' + id)
      .toPromise();
  }

  attachAuthor(studyId: string, authorId: string): Observable<any> {
    return this.http.post(this.api + 'author/combine?authorId=' + authorId + '&studyId=' + studyId, {});
  }

  save(study: Study, surveyProgramId: String): Observable<any>  {
    return this.http.post(this.api + 'study/create/' + surveyProgramId, study);
  }

  update(study: Study): Observable<any>  {
    return this.http.post(this.api + 'study/', study);
  }

  deattachAuthor(studyId: string, authorId: string): Observable<any>  {
    return this.http.delete(this.api + 'author/decombine?authorId=' + authorId + '&studyId=' + studyId);
  }

  deleteStudy(id: string): Observable<any>  {
    return this.http.delete(this.api + 'study/delete/' + id);
  }
}
