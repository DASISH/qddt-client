import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../core/user/user.service';
import { Authority } from '../core/user/authority';
import { Page } from '../shared/classes/classes';
import { ActionKind, ElementKind} from '../shared/classes/enums';
import { QDDT_QUERY_INFOES} from '../shared/classes/constants';
import { IEntityAudit, IEntityEditAudit, IPageResult, IRevisionResult, IPageSearch } from '../shared/classes/interfaces';

@Injectable()
export class TemplateService {

  private roles = 0;

  constructor(protected http: HttpClient, private userService: UserService, @Inject(API_BASE_HREF) protected api: string) {
    userService.getRoles().forEach((role) => this.roles += +Authority[role]);
  }

  public searchByKind<T extends IEntityAudit>(pageSearch: IPageSearch): Promise<IPageResult<T>> {
    const qe = QDDT_QUERY_INFOES[pageSearch.kind];
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
    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.get<T>(this.api + qe.path + '/' + id).toPromise();
  }

  public getRevisionsByKind<T extends IEntityAudit>(kind: ElementKind, id: string): Promise<IPageResult<IRevisionResult<T>>> {
    const qe = QDDT_QUERY_INFOES[kind];
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
    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.get<IRevisionResult<IEntityEditAudit>>(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();
  }

  public copySource(kind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<any> {
    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.post(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  public update(item: IEntityAudit): Observable<any> {
    console.log('Template update... ');
    const kind = this.getElementKind(item.classKind);
    const qe = QDDT_QUERY_INFOES[kind];
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
    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.post<any>(this.api +  qe.path + '/createfile/', form);
  }

  public delete(item: IEntityEditAudit): Observable<any> {
    const kind = ElementKind[item.classKind];
    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.delete(this.api + qe.path + '/delete/' + item.id);
  }

  public deleteByKind(kind: ElementKind, id: string): Observable<any> {
    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.delete(this.api + qe.path + '/delete/' + id);
  }

  public getPdf(item: IEntityEditAudit): Promise<Blob>  {
    const kind = ElementKind[item.classKind];
    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.get(this.api + qe.path + '/pdf/' + item.id, { responseType: 'blob'}).toPromise();
  }

  public getFile(id: string): Promise<Blob> {
    return this.http.get(this.api + 'othermaterial/files/' + id, { responseType: 'blob'})
      .toPromise();
  }

  public deleteFile(id: string): Observable<any> {
    return this.http.delete(this.api + 'othermaterial/delete/' + id);
  }

  public uploadFile(id: string, type: string = '/T', files: any): Observable<any> {
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id + type, formData)
      .map((res: any) => {
        try {
          return res;
        } catch (e) {
          return [];
        }
      });
  }

  public can(action: ActionKind, kind: ElementKind): boolean {

    function canRead() {
      return true;
    }

    function canUpdate(roles: number) {
      if (roles >= +Authority.ROLE_EDITOR) {
        return true;
      } else if (roles >= +Authority.ROLE_CONCEPT) {
          return (kind === ElementKind.TOPIC_GROUP || kind ===  ElementKind.CONCEPT);
      } else {
        return false;
      }
    }

    function canDelete(roles: number) {
      if (roles >= +Authority.ROLE_ADMIN) {
        return true;
      } else if (roles >= +Authority.ROLE_EDITOR ) {
        return ( kind !== ElementKind.SURVEY_PROGRAM && kind !== ElementKind.STUDY );
      } else {
        return false;
      }
    }

    switch (action) {
      case ActionKind.Read:
        return canRead();
      case ActionKind.Create:
      case ActionKind.Update:
        return canUpdate(this.roles);
      case ActionKind.Delete:
        return canDelete(this.roles);
      default:
        return false;
    }
  }

  public getElementKind(kind: string|ElementKind): ElementKind {
    return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
  }

}
