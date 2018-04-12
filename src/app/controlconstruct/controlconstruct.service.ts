import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Observable';
import { QuestionItem } from '../question/question.service';
import { QddtElement, QDDT_ELEMENTS, ElementKind, ElementRevisionRef } from '../shared/elementinterfaces/elements';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';
import { Page } from '../shared/table/table.page';

export enum SequenceKind {
  NA,
  QUESTIONNAIRE,
  SECTION,
  BATTERY,
  UNIVERSE
}

export class Universe implements IEntityAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.UNIVERSE];
}

export class Instruction implements IEntityAudit {
  id: string;
  name: string;
  description: string;
  classKind = ElementKind[ElementKind.INSTRUCTION];
}

export class ConditionCommand {
  type: ElementKind;
  constructId: string;
  constructName: string;
  command: string;
}


export class QuestionConstruct implements IEntityAudit {
  id: string;
  name: string;
  classKind = ElementKind[ElementKind.QUESTION_CONSTRUCT];
  questionItem: QuestionItem;
  questionItemRevision: number;
  otherMaterials: any;
  universe: Universe[];
  preInstructions: Instruction[];
  postInstructions: Instruction[];
}

export class SequenceConstruct implements IEntityAudit {
  id: string;
  name: string;
  label: string;
  description: string;
  classKind = ElementKind[ElementKind.SEQUENCE_CONSTRUCT];
  sequenceKind = SequenceKind[SequenceKind.SECTION];
  sequence: ElementRevisionRef[];
}

export class StatementConstruct implements IEntityAudit {
  id: string;
  name: string;
  statement: string;
  classKind = ElementKind[ElementKind.STATEMENT_CONSTRUCT];
}

export class ConditionConstruct implements IEntityAudit {
  id: string;
  name: string;
  condition: string;
  classKind = ElementKind[ElementKind.CONDITION_CONSTRUCT];
  ifCondition: ConditionCommand;
  elseConditions: ConditionCommand[];
}


@Injectable()
export class ControlConstructService  {


  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  public getControlConstruct<T>(id: string): Promise<T>  {
    return this.http.get<T>(this.api + 'controlconstruct/' + id).toPromise();
  }

  public searchByKind(kind: ElementKind, searchString: string = '',  page: Page = new Page() ): Promise<any> {
    const qe = QDDT_ELEMENTS[kind];
    const args = searchString.split(' ');
    const queries = [];

    if (args.length <= qe.fields.length) {
      for (let i = 0; i < args.length; i++) {
        queries.push(qe.fields[i] + '=' + args[i].trim() );
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=' + searchString.trim() );
      }
    }

    let query = '?' ;

    if (queries.length > 0) { query = queries.join('&'); }

    query += page.queryPage();
    query += qe.parameter;

    return this.http.get(this.api + qe.path + '/page/search/' + query).toPromise();
  }

  public getFile(id: string): Promise<Blob>  {
    return this.http.get(this.api + 'othermaterial/files/' + id, {responseType: 'blob'}).toPromise();
  }

  public getPdf(id: string): Promise<Blob>  {
    return this.http.get(this.api + 'controlconstruct/pdf/' + id, { responseType: 'blob'}).toPromise();
  }

  public createWithfiles(form: FormData ): Observable<QuestionConstruct> {
    return this.http.post<QuestionConstruct>(this.api + 'controlconstruct/createfile/', form);
  }

  public updateCondition(cc: ConditionConstruct): Observable<ConditionConstruct> {
    const path = 'controlconstruct/condition/';
    return this.http.post<ConditionConstruct>(this.api + path , cc);
  }

  public updateQuestion(cc: QuestionConstruct): Observable<QuestionConstruct> {
    const path = 'controlconstruct/question/';
    return this.http.post<QuestionConstruct>(this.api + path , cc);
  }

  public updateSequence(cc: SequenceConstruct): Observable<SequenceConstruct> {
    const path = 'controlconstruct/sequence/';
    return this.http.post<SequenceConstruct>(this.api + path , cc);
  }

  public updateStatement(cc: StatementConstruct): Observable<StatementConstruct> {
    const path = 'controlconstruct/statement/';
    return this.http.post<StatementConstruct>(this.api + path , cc);
  }

  public delete(id: string): Observable<any> {
    return this.http.delete(this.api + 'controlconstruct/delete/' + id);
  }

  public deleteFile(id: string): Observable<any> {
    return this.http.delete(this.api + 'othermaterial/delete/' + id);
  }

  public uploadFile(id: string, files: any): Observable<any> {
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id + '/CC', formData)
      .map((res: any) => {
        try {
          return res;
        } catch (e) {
          return [];
        }
      });
  }

}
