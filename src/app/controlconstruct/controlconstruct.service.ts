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

  readonly pageSize = '&size=10';

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  public getControlConstruct<T>(id: string): Promise<T>  {
    console.log('getControlConstruct');
    return this.http.get<T>(this.api + 'controlconstruct/' + id).toPromise();
  }

  public getControlConstructRevision(id: string, rev: string): Promise<any>  {
    return this.http.get(this.api + 'audit/controlconstruct/' + id + '/' + rev).toPromise();
  }

  public getControlConstructsByQuestionItem(id: string): Promise<any>  {
    return this.http.get(this.api + 'controlconstruct/list/by-question/' + id).toPromise();
  }

  public getQuestionItems(key: string): Promise<any> {
    return this.http.get(this.api + 'questionitem/page/').toPromise();
  }

  public getQuestionItemsRevisions(id: string): Promise<any> {
    return this.http.get(this.api + 'audit/questionitem/' + id + '/all').toPromise();
  }

  public getConceptsByQuestionitemId(id: string): Promise<any> {
    return this.http.get(this.api + 'concept/list/by-QuestionItem/' + id).toPromise();
  }

  public getFile(id: string): Promise<Blob>  {
    return this.http.get(this.api + 'othermaterial/files/' + id, {responseType: 'blob'}).toPromise();
  }

  public getPdf(id: string): Promise<Blob>  {
    return this.http.get(this.api + 'controlconstruct/pdf/' + id, { responseType: 'blob'}).toPromise();
  }

  // public searchControlConstructs(searchString: string = '*',  page: Page): Promise<any> {
  //   console.log('searchControlConstructs');
  //   let query = '&name=' + name + '&questiontext=' + questionText;
  //   if (sort.length > 0) {
  //     query += '&sort=' + sort;
  //   }
  //   return this.http.get(this.api + 'controlconstruct/page/search/?constructkind=QUESTION_CONSTRUCT'
  //     + '&page=' + page + this.pageSize + query).toPromise();
  // }
  //
  // public searchSequenceConstructs(name: string = '*',  page: String = '0', sort: string = ''): Promise<any> {
  //   console.log('searchSequenceConstructs');
  //   let query = '&name=' + name ;
  //   if (sort.length > 0) { query += '&sort=' + sort; }
  //
  //   return this.http.get(this.api + 'controlconstruct/page/search/?constructkind=SEQUENCE_CONSTRUCT'
  //     + '&page=' + page + this.pageSize + query).toPromise();
  // }
  //
  // public searchQuestionItemsByNameAndQuestion(name: string = '', page: String = '0', sort: String = ''): Promise<any> {
  //   let query = name.length > 0 ? '&question=' + '*' + name + '*' + '&name=' + '*' + name + '*' : '';
  //   if (sort.length > 0) {
  //     query += '&sort=' + sort;
  //   }
  //   return this.http.get(this.api + 'questionitem/page/search?' + 'page=' + page + this.pageSize + query).toPromise();
  // }

  public searchInstructions(description: string = '', page: String = '0'): Promise<any> {
    const query = description.length > 0 ? '&description=' + '*' + description + '*' : '';
    return this.http.get(this.api + 'instruction/page/search?' + 'page=' + page + this.pageSize + query).toPromise();
  }

  public searchUniverses(description: string = '', page: String = '0'): Promise<any> {
    const query = description.length > 0 ? '&description=' + '*' + description + '*' : '';
    return this.http.get(this.api + 'universe/page/search?' + 'page=' + page + this.pageSize + query).toPromise();
  }

  public createCondition(cc: ConditionConstruct): Observable<ConditionConstruct> {
    return this.http.post<ConditionConstruct>(this.api + 'controlconstruct/condition/create/', cc);
  }

  public createWithfiles(form: FormData ): Observable<QuestionConstruct> {
    return this.http.post<QuestionConstruct>(this.api + 'controlconstruct/createfile/', form);

//    return this.http.post("createfile",form)
//    .map((response: Response) => response.json() as ArticleModel);

  }

  public createQuestion(cc: QuestionConstruct): Observable<QuestionConstruct> {
    return this.http.post<QuestionConstruct>(this.api + 'controlconstruct/question/create/', cc);
  }

  public createSequence(cc: SequenceConstruct): Observable<SequenceConstruct> {
    return this.http.post<SequenceConstruct>(this.api + 'controlconstruct/sequence/create/', cc);
  }

  public createStatement(cc: StatementConstruct): Observable<StatementConstruct> {
    return this.http.post<StatementConstruct>(this.api + 'controlconstruct/statement/create/', cc);
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


  public deleteControlConstruct(id: string): Observable<any> {
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
    return this.http.get(this.api + 'controlconstruct/page/search?constructkind=' + ElementKind[ccKind] + query)
      .toPromise();
  }

  public getQddtElementFromStr(kind: string): QddtElement {
    const element: any = QDDT_ELEMENTS.find(e => ElementKind[e.id] === kind);
    if (!element) {
      throw Error('Couldn\'t find kind ' + kind);
    }
    return element;
  }

  getRevisions(id: string): Promise<any> {
    return this.http.get(this.api + 'audit/controlconstruct/' + id + '/all')
      .toPromise()
      .catch(err => { throw Error(err.message); });

  }

}
