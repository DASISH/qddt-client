import {Inject, Injectable, OnDestroy, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { Observable, Subscription, BehaviorSubject} from 'rxjs';
import { UserService } from '../core/user/user.service';
import { ActionKind, ElementKind} from '../shared/classes/enums';
import { getQueryInfo } from '../shared/classes/constants';
import { IEntityAudit, IEntityEditAudit, IPageResult, IRevisionResult, IPageSearch, IOtherMaterial } from '../shared/classes/interfaces';

@Injectable()
export class TemplateService {

  constructor(protected http: HttpClient, private userService: UserService, @Inject(API_BASE_HREF) protected api: string) { }

  public searchByUuid(id: string): Promise<any> {
    return this.http.get(this.api + 'search/' + id).toPromise();
  }

  public searchByKind<T extends IEntityAudit>(pageSearch: IPageSearch): Promise<IPageResult<T>> {
    const qe = getQueryInfo(pageSearch.kind);
    const args = pageSearch.key.split(' ');
    const queries = [];

    if (args.length <= qe.fields.length) {
      for (let i = 0; i < args.length; i++) {
        queries.push(qe.fields[i] + '=' + args[i].trim() );
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=' + pageSearch.key.trim() );
      }
    }

    if (pageSearch.keys) {
      pageSearch.keys.forEach( (value, key) => queries.push(key + '=' + value ) );
    }

    let query = '?' ;

    if (queries.length > 0) { query = '?' + queries.join('&'); }

    query += pageSearch.page.queryPage();

    if (qe.parameter) { query += qe.parameter; }

    if ( pageSearch.sort ) { query += '&sort=' + pageSearch.sort; }


    return this.http.get<IPageResult<T>>(this.api + qe.path + '/page/search/' + query).toPromise();
  }

  public getItemByKind<T extends IEntityEditAudit>(kind: ElementKind, id: string ): Promise<T> {
    const qe = getQueryInfo(kind);
    return this.http.get<T>(this.api + qe.path + '/' + id).toPromise();
  }

  public getRevisionsByKind<T extends IEntityAudit>(kind: ElementKind, id: string): Promise<IPageResult<IRevisionResult<T>>> {
    const qe = getQueryInfo(kind);
    if (qe) {
      if (kind === ElementKind.CONCEPT || kind === ElementKind.TOPIC_GROUP) {
        return this.http.get<IPageResult<IRevisionResult<T>>>
              (this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
      } else {
        return this.http.get<IPageResult<IRevisionResult<T>>>
              (this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
      }
    }
    return new Promise(null);
  }

  public getRevisionByKind(kind: ElementKind, id: string, rev: number): Promise<IRevisionResult<IEntityEditAudit>> {
    const qe = getQueryInfo(kind);
    return this.http.get<IRevisionResult<IEntityEditAudit>>(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();
  }

  public copySource(kind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<any> {
    const qe = getQueryInfo(kind);
    return this.http.post(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  public update(item: IEntityAudit): Observable<any> {
    const kind = this.getElementKind(item.classKind);
    const qe = getQueryInfo(kind);
    let path2 = '';
    if (qe.path === 'controlconstruct' ) { // silly exception to the simple rule
      if (kind === ElementKind.QUESTION_CONSTRUCT ) {
        path2 = '/question';
      } else if (kind === ElementKind.SEQUENCE_CONSTRUCT ) {
        path2 = '/sequence';
      } else if (kind === ElementKind.CONDITION_CONSTRUCT ) {
        path2 = '/condition';
      } else if (kind === ElementKind.STATEMENT_CONSTRUCT ) {
        path2 = '/statement';
      }
    }
    return this.http.post(this.api + qe.path + path2, item);
  }

  public updateWithfiles(kind: ElementKind, form: FormData ): Observable<any> {
    const qe = getQueryInfo(kind);
    return this.http.post( this.api +  qe.path + '/createfile/', form, { reportProgress: true} );
  }

  public delete(item: IEntityEditAudit): Observable<any> {
    const qe = getQueryInfo[item.classKind];
    return this.http.delete(this.api + qe.path + '/delete/' + item.id);
  }

  public getPdf(item: IEntityEditAudit): Promise<Blob>  {
    const qe = getQueryInfo[item.classKind];
    return this.http.get(this.api + qe.path + '/pdf/' + item.id, { responseType: 'blob'}).toPromise();
  }

  public getXML(item: IEntityEditAudit): Promise<Blob>  {
    const qe = getQueryInfo[item.classKind];
    return this.http.get(this.api + qe.path + '/xml/' + item.id, { responseType: 'blob'}).toPromise();
  }

  public getFile(om: IOtherMaterial): Promise<Blob> {
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob'}).toPromise();
  }

  public can(action: ActionKind, kind: ElementKind): boolean {
    return this.userService.canDo(action, kind);
  }

  public getElementKind(kind: string|ElementKind): ElementKind {
    return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
  }

}
