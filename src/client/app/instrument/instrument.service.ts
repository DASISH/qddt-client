import { Injectable, Inject } from '@angular/core';
// import { Http } from '@angular/http';

import { API_BASE_HREF } from '../api';
import { BaseService } from '../shared/base.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

export class Instrument {
  id: string;
  name: string;
  description: string;
  instrumentType: string;
  controlConstructs: any[];
}

@Injectable()
export class InstrumentService extends BaseService {

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    super(http, auth , api);
  }

  create(c: Instrument): any {
    return this.post(c, 'instrument/create');
  }

  update(c: Instrument): any {
    return this.post(c, 'instrument/');
  }

}
