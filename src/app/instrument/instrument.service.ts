import { Injectable, Inject } from '@angular/core';
import { API_BASE_HREF } from '../api';
import { HttpClient } from '@angular/common/http';
import {IEntityAudit} from '../shared/elementinterfaces/entityaudit';
import {ElementKind} from '../shared/elementinterfaces/elements';

export class Instrument implements IEntityAudit {
  id: string;
  name: string;
  description: string;
  instrumentType: string;
  controlConstructs: any[];
  comments: any[];
  classKind = ElementKind[ElementKind.INSTRUMENT];
}

@Injectable()
export class InstrumentService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  create(intrument: Instrument): any {
    return this.http.post(this.api + 'instrument/create', intrument);
  }

  update(intrument: Instrument): any {
    return this.http.post(this.api + 'instrument/' , intrument);
  }

}
