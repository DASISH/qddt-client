import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { Observable }     from 'rxjs/Observable';

@Injectable()
export class RevisionService extends BaseService {

  readonly pageSize = '&size=10';

  constructor(protected http: Http, @Inject(API_BASE_HREF) protected api: string) {
    super(http, api);
  }

  getAllRevisions(qddtURI: string) : any {
    return this.get(qddtURI);
  }

  getRevisionPage(qddtURI: string, page: String = '0'): any {
    return this.get(qddtURI + '?&page=' + page + this.pageSize );
  }

  getelement(type: string, id: string, rev: string): any {
    if( type === 'survey') {
      return this.get('audit/surveyprogram/' + id +'/'+ rev);
    } else if( type === 'category') {
      return this.get('audit/category/' + id +'/'+ rev);
    } else if( type === 'controlconstruct') {
      return this.get('audit/controlconstruct/' + id +'/'+ rev);
    } else if( type === 'concept') {
      return this.get('audit/concept/' + id +'/'+ rev);
    }
    return Observable.of({});
  }

}
