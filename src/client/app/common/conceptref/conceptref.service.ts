import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../base.service';

@Injectable()
export class ConceptrefService extends BaseService {

  readonly pageSize = '&size=10';

  constructor(protected http: Http, @Inject(API_BASE_HREF) protected api: string) {
    super(http, api);
  }

  getConceptsById(id: string) {
    return this.get('concept/'+ id);
  }

  getTopicById(id: string) {
    return this.get('topicgroup/'+ id);
  }

  getStudyById(id: string) {
    return this.get('study/'+ id);
  }
}
