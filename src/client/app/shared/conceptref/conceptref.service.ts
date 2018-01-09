import { Injectable, Inject } from '@angular/core';
// import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../base.service';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConceptrefService extends BaseService {

  readonly pageSize = '&size=10';

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    super(http, auth , api);
  }

  getConceptsById(id: string) {
    return this.get('concept/' + id);
  }

  getTopicById(id: string) {
    return this.get('topicgroup/' + id);
  }

  getStudyById(id: string) {
    return this.get('study/' + id);
  }
}
