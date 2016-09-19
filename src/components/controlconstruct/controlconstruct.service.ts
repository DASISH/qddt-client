import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';

export class ControlConstruct {
  id: string;
  name: string;
}

@Injectable()
export class ControlConstructService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(c: ControlConstruct): any {
    return this.post(c,'controlconstruct/create/');
  }

  edit(c: ControlConstruct): any {
    return this.post(c, 'controlconstruct/');
  }

  getAll(): any {
    return this.get('controlconstruct/page/search/');
  }

}
