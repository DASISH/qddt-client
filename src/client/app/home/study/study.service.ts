import { Injectable, Inject } from '@angular/core';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../shared/base.service';
// import { Http } from '@angular/http';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
// import { HttpClient } from '@angular/common/http';

export class Study {
  id: string;
  name: string;
  description: string;
  archived: boolean;
}

@Injectable()
export class StudyService extends BaseService {

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    super(http, auth , api);
  }

  save(study: Study, surveyProgramId: String): any {
    return this.post(study, 'study/create/' + surveyProgramId);
  }

  update(study: Study): any {
    return this.post(study, 'study');
  }

  getAll(surveyProgramId: String): any {
    return this.get('surveyprogram/' + surveyProgramId);
  }

  getStudy(id: String): any {
    return this.get('study/' + id);
  }

  attachAuthor(studyId: string, authorId: string): any {
    return this.post({}, 'author/combine?authorId=' + authorId + '&studyId=' + studyId);
  }

  deattachAuthor(studyId: string, authorId: string): any {
    return this.delete('author/decombine?authorId=' + authorId + '&studyId=' + studyId);
  }

  getPdf(id: string): any {
    return this.getBlob('study/pdf/' + id);
  }

  deleteStudy(id: string): any {
    return this.delete('study/delete/' + id);
  }
}
