import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';

@Injectable()
export class RevisionService extends BaseService {

  constructor(protected http: Http, @Inject(API_BASE_HREF) protected api: string) {
    super(http, api);
  }

  getAllRevisions(qddtURI: string) : any {
    return this.get(qddtURI);
  }

}
