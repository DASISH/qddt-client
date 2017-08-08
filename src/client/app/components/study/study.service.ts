import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export class Study {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class StudyService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(study: Study, surveyProgramId: String): any {
    return this.post(study,'study/create/' +surveyProgramId);
  }

  update(study: Study): any {
    return this.post(study,'study');
  }

  getAll(surveyProgramId: String) : any {
    return this.get('surveyprogram/'+surveyProgramId);
  }

  getStudy(id: String) : any {
    return this.get('study/' + id);
  }

  attachAuthor(studyId: string, authorId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&studyId=' +studyId);
  }

  deattachAuthor(studyId: string, authorId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&studyId=' +studyId);
  }

  getPdf(id: string): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'study/pdf/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }

  deleteStudy(id: string): any {
    return this.delete('study/delete/'+ id);
  }
}
