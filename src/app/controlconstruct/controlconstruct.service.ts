import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Observable';
import { Page } from '../shared/classes/classes';
import { ConditionConstruct, QuestionConstruct, SequenceConstruct, StatementConstruct} from './controlconstruct.classes';
import { ElementKind } from '../shared/classes/enums';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import {IEntityAudit, IPageResult} from '../shared/classes/interfaces';

@Injectable()
export class ControlConstructService  {


  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  public getControlConstruct<T extends IEntityAudit>(id: string): Promise<T>  {
    return this.http.get<T>(this.api + 'controlconstruct/' + id).toPromise();
  }

  public searchByKind<T extends IEntityAudit>(kind: ElementKind, search: string = '',  page: Page = new Page() ): Promise<IPageResult<T>> {
    const qe = QDDT_QUERY_INFOES[kind];
    const args = search.split(' ');
    const queries = [];

    if (args.length <= qe.fields.length) {
      for (let i = 0; i < args.length; i++) {
        queries.push(qe.fields[i] + '=' + args[i].trim() );
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=' + search.trim() );
      }
    }

    let query = '?' ;

    if (queries.length > 0) { query += queries.join('&'); }

    query += page.queryPage();
    query += (qe.parameter) ? qe.parameter : '';

    return this.http.get<IPageResult<T>>(this.api + qe.path + '/page/search/' + query).toPromise();
  }

  public getFile(id: string): Promise<Blob>  {
    return this.http.get(this.api + 'othermaterial/files/' + id, {responseType: 'blob'}).toPromise();
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
