import { Injectable, Inject } from '@angular/core';
import { API_BASE_HREF } from '../api';
import { HttpClient } from '@angular/common/http';

export class Instrument {
  id: string;
  name: string;
  description: string;
  instrumentType: string;
  controlConstructs: any[];
}

@Injectable()
export class InstrumentService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  create(intrument: Instrument): any {
    return this.http.post(this.api + 'instrument/create',intrument);
  }

  update(intrument: Instrument): any {
    return this.http.post(this.api + 'instrument/' ,intrument);
  }

}
