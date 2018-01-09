import { Injectable, Inject } from '@angular/core';
// import { Http } from '@angular/http';

import { API_BASE_HREF } from '../api';
import { BaseService } from '../shared/base.service';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

export const ElementTypeDescription = [
  { id: 0, name: 'SEQUENCE_CONSTRUCT', label: 'Sequence' },
  { id: 1, name: 'QUESTION_CONSTRUCT', label: 'Question construct' },
  { id: 2, name: 'STATEMENT_CONSTRUCT', label: 'Statement' },
  { id: 3, name: 'CONDITION_CONSTRUCT', label: 'Condition' }
];

export class Sequence {
  id: string;
  name: string;
  description: string;
  children: any[];
  sequence: any;
}

export class Statement {
  id: string;
  name: string;
  Text: string;
}

export class ConditionCommand {
  type: string;
  constructId: string;
  constructName: string;
  command: string;
}

export class Condition {
  id: string;
  name: string;
  ifCondition: any;
  elseConditions: any[];
}

@Injectable()
export class SequenceService extends BaseService {

  constructor(protected http: HttpClient, protected auth: AuthService, @Inject(API_BASE_HREF) protected api: string) {
    super(http, auth , api);
  }

  create(sequence: Sequence): any {
    return this.post(sequence, 'controlconstruct/create');
  }

  update(sequence: Sequence): any {
    return this.post(sequence, 'controlconstruct/');
  }

  getElements(elementType: string, name: string, page: string = '0', sort: string = '') {
    let query = '';
    if (name.length > 0) {
      query = '&name=*' + name + '*' + '&questiontext=*' + name + '*';
    }
    if (page.length > 0 && page !== '0') {
      query += '&page=' + page;
    }
    if (sort.length > 0) {
      query += '&sort=' + sort;
    }
    return this.get('controlconstruct/page/search?constructkind=' + elementType + query);
  }

}
