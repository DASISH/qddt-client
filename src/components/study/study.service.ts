import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';

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
    return this.post(study,'study/');
  }

  getAll(surveyProgramId: String) : any {
    return this.get('surveyprogram/'+surveyProgramId);
  }

  attachAuthor(studyId: string, authorId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&studyId=' +studyId);
  }

  deattachAuthor(studyId: string, authorId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&studyId=' +studyId);
  }
}
