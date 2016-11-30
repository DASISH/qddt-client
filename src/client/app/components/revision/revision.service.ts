import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class RevisionService extends BaseService {

  constructor(protected http: Http, @Inject(API_BASE_HREF) protected api: string) {
    super(http, api);
  }

  getAllRevisions(qddtURI: string) : any {
    return this.get(qddtURI);
  }

  getelement(type: string, id: string): any {
    if( type === 'survey') {
      return this.get('surveyprogram/' + id);
    } else if( type === 'category') {
      return this.get('category/' + id);
    } else if( type === 'controlconstruct') {
      return this.get('controlconstruct/' + id);
    } else if( type === 'concept') {
      return this.get('concept/' + id);
    }
    return Observable.of({});
  }

}
