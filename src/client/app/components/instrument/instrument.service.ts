import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export class Instrument {
  id: string;
  name: string;
  description: string;
  instrumentType: string;
  controlConstructs: any[];
}

@Injectable()
export class InstrumentService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  create(c: Instrument): any {
    return this.post(c, 'instrument/create');
  }

  update(c: Instrument): any {
    return this.post(c, 'instrument/');
  }

}
