import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { Observable }     from 'rxjs/Observable';

export const ElementTypeDescription = [
  { id: 0, name: 'sequence', label: 'Sequence' },
  { id: 1, name: 'controlconstruct', label: 'Control construct' },
  { id: 2, name: 'statement', label: 'Statement' },
  { id: 3, name: 'condition', label: 'Condition' }
];

export class Sequence {
  id: string;
  name: string;
  description: string;
  statement: any;
  condition: any;
  questionConstruct: any;
  sequence: any;
}

export class Statement {
  id: string;
  name: string;
  Text: string;
}

export class Condition {
  id: string;
  name: string;
  IfCondition: any;
  ElseCondition: any[];
}

@Injectable()
export class SequenceService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  create(sequence: Sequence): any {
    return this.post(sequence, 'sequence/create');
  }

  update(sequence: Sequence): any {
    return this.post(sequence, 'sequence/');
  }

  getSequences(key: string) {
    let sequences: any[] = [
      {
        id: '1', name: 'A1-A12', description: 'this is A1-A12 demo.',
        'agency': this.getAgency(),
        'modified': [2016, 11, 7, 10, 23, 57, 685000000],
        'modifiedBy': this.getModifiedBy(),
        'sequence': {
          id: '1', name: 'B1-B12', description: 'this is B1-B12 demo.',
          'agency': this.getAgency(),
          'modified': [2016, 11, 9, 10, 23, 57, 685000000],
          'modifiedBy': this.getModifiedBy(),
          version: { major: 1, minor: 0, versionLabel: '' }
        },
        'condition': {
          id: '1', name: 'c1', description: 'this is Condition demo.',
          'agency': this.getAgency(),
          'modified': [2016, 11, 9, 10, 23, 57, 685000000],
          'modifiedBy': this.getModifiedBy(),
          version: { major: 1, minor: 0, versionLabel: '' }
        },
        'statement': {
          id: '1', name: 's1', description: 'this is statement demo.',
          'agency': this.getAgency(),
          'modified': [2016, 11, 9, 10, 23, 57, 685000000],
          'modifiedBy': this.getModifiedBy(),
          version: { major: 1, minor: 0, versionLabel: '' }
        },
        version: { major: 1, minor: 2, versionLabel: '' }
      },
      {
        id: '2', name: 'B1-B12', description: 'this is B1-B12 demo',
        'agency': this.getAgency(),
        'modified': [2016, 11, 8, 10, 23, 57, 685000000],
        'modifiedBy': this.getModifiedBy(),
        version: { major: 1, minor: 2, versionLabel: '' }
      }
    ];
    return Observable.of(sequences);
  }

  getStatements(key: string) {
    let statements: any[] = [
      {
        id: 'statement-1', name: 'Statement1', description: 'this is statement demo.',
        'text': 'statement1',
        'agency': this.getAgency(),
        'modified': [2016, 11, 7, 10, 23, 57, 685000000],
        'modifiedBy': this.getModifiedBy(),
        version: { major: 1, minor: 2, versionLabel: '' }
      },
      {
        id: 'statement-2', name: 'Statement2', description: 'this is Statement2 demo',
        'text': 'statement2',
        'agency': this.getAgency(),
        'modified': [2016, 11, 8, 10, 23, 57, 685000000],
        'modifiedBy': this.getModifiedBy(),
        version: { major: 1, minor: 2, versionLabel: '' }
      }
    ];
    return Observable.of(statements);
  }

  getConditions(key: string) {
    return Observable.of([]);
  }

  getConstructs(key: string) {
    return Observable.of([]);
  }

  getElements(elementType: number, key: string) {
    if(elementType === 0) {
      return this.getSequences(key);
    } else if(elementType === 1) {
      return this.getConstructs(key);
    } else if(elementType === 2) {
      return this.getStatements(key);
    } else if(elementType === 3) {
      return this.getConditions(key);
    }
    return Observable.of([]);
  }

  private getAgency() {
    return {
            'id': '1359dede-9f18-11e5-8994-feff819cdc9f',
            'modified': null, 'modifiedBy': null, 'name': 'NSD-qddt'
          };
  }

  private getModifiedBy() {
    return {
          'id': '83d4c034-4ff9-11e5-885d-feff819cdc9f',
          'username': 'admin',
          'email': 'admin@example.org',
          'agency': this.getAgency()
        };
  }

}
