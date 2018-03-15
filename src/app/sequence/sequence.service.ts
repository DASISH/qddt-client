import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Observable';
import { ElementKind, QddtElement, QddtElements } from '../preview/preview.service';


export const ElementTypeDescription: QddtElement[] = [
  QddtElements[ElementKind.QUESTION_CONSTRUCT],
  QddtElements[ElementKind.STATEMENT_CONSTRUCT],
  QddtElements[ElementKind.CONDITION_CONSTRUCT],
  QddtElements[ElementKind.SEQUENCE_CONSTRUCT]
];

export enum SequenceKind {
  NA,
  QUESTIONNAIRE,
  SECTION,
  BATTERY,
  UNIVERSE
}



export class Sequence {
  id: string;
  name: string;
  description: string;
  children: any[];
  sequence: SequenceKind;
  classKind = ElementKind.SEQUENCE_CONSTRUCT;
}

export class Statement {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind.STATEMENT_CONSTRUCT;
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
  condition: string;
  ifCondition: ConditionCommand;
  elseConditions: ConditionCommand[];
  classKind = ElementKind.CONDITION_CONSTRUCT;
}

@Injectable()
export class SequenceService {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) { }

  public create(sequence: any): Observable<any> {
    return this.http.post( this.api + 'controlconstruct/create', sequence);
  }

  public update(sequence: any): Observable<any> {
    return this.http.post(this.api + 'controlconstruct/', sequence);
  }


  public getElements(ccKind: ElementKind, name: string, page: string = '0', sort: string = ''): Promise<any> {
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
    return this.http.get(this.api + 'controlconstruct/page/search?constructkind=' + ccKind.toString + query)
      .toPromise();
  }

  public getPdf(id: string): Observable<Blob> {
    return this.http.get(this.api + 'controlconstruct/pdf/' + id, {responseType: 'blob'});

  }

  public getQddtElementFromStr(kind: string): QddtElement {
    const element: any = ElementTypeDescription.find(e => ElementKind[e.id] === kind);
    if (!element) {
      throw Error('Couldn\'t find kind ' + kind);
    }
    return element;
  }

}
