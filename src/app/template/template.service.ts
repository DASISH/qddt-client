import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ElementKind, QDDT_ELEMENTS } from '../shared/elementinterfaces/elements';
import { IEntityEditAudit } from '../shared/elementinterfaces/entityaudit';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../core/user/user.service';
import { Action } from '../shared/elementinterfaces/detailaction';
import { Authority } from '../core/user/authority';
import { Page } from '../shared/table/table.page';

@Injectable()
export class TemplateService {

  private roles = 0;

  constructor(protected http: HttpClient, private userService: UserService, @Inject(API_BASE_HREF) protected api: string) {
    userService.getRoles().forEach((role) => this.roles += +Authority[role]);
  }

  public searchByKind(kind: ElementKind, searchString: string = '',  page: Page = new Page()): Promise<any> {
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

    if (queries.length > 0) { query = '?' + queries.join('&'); }

    query += page.queryPage();
    query += qe.parameter;

    return this.http.get(this.api + qe.path + '/page/search/' + query).toPromise();
  }

  public getItemByKind(kind: ElementKind, id: string ): Promise<IEntityEditAudit> {
    const qe = QDDT_ELEMENTS[kind];
    return this.http.get<IEntityEditAudit>(this.api + qe.path + '/' + id).toPromise();
  }

  public getRevisionsByKind(kind: ElementKind, id: string): Promise<any> {
    const qe = QDDT_ELEMENTS[kind];
    if (qe) {
      if (kind === ElementKind.CONCEPT || kind === ElementKind.TOPIC_GROUP) {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
      } else {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
      }
    }
    return new Promise(null);
  }

  public getRevisionByKind(kind: ElementKind, id: string, rev: number): Promise<any> {
    const qe = QDDT_ELEMENTS[kind];
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();
  }

  public copySource(kind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<any> {
    const qe = QDDT_ELEMENTS[kind];
    return this.http.post(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  public update(item: IEntityEditAudit): Observable<any> {
    const qe = QDDT_ELEMENTS[this.getElementKind(item.classKind)];
    return this.http.post(this.api + qe.path , item);
  }

  public updateWithfiles(kind: ElementKind, form: FormData ): Observable<any> {
    const qe = QDDT_ELEMENTS[kind];
    return this.http.post<any>(this.api +  qe.path + '/createfile/', form);
  }

  public delete(item: IEntityEditAudit): Observable<any> {
    const kind = ElementKind[item.classKind];
    const qe = QDDT_ELEMENTS[kind];
    return this.http.delete(this.api + qe.path + '/delete/' + item.id);
  }

  public deleteByKind(kind: ElementKind, id: string): Observable<any> {
    const qe = QDDT_ELEMENTS[kind];
    return this.http.delete(this.api + qe.path + '/delete/' + id);
  }

  public getPdf(item: IEntityEditAudit): Promise<Blob>  {
    const kind = ElementKind[item.classKind];
    const qe = QDDT_ELEMENTS[kind];
    return this.http.get(this.api + qe.path + '/pdf/' + item.id, { responseType: 'blob'}).toPromise();
  }

  public getFile(id: string): Promise<any> {
    return this.http.get(this.api + 'othermaterial/files/' + id, { responseType: 'blob'})
      .toPromise();
  }

  public deleteFile(id: string): Observable<any> {
    return this.http.delete(this.api + 'othermaterial/delete/' + id);
  }

  public uploadFile(id: string, files: any): Observable<any> {
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id + '/T', formData)
      .map((res: any) => {
        try {
          return res;
        } catch (e) {
          return [];
        }
      });
  }

  public can(action: Action, kind: ElementKind): boolean {

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
      case Action.Read:
        return canRead();
      case Action.Create:
      case Action.Update:
        return canUpdate(this.roles);
      case Action.Delete:
        return canDelete(this.roles);
      default:
        return false;
    }
  }

  public getElementKind(kind: string|ElementKind): ElementKind {
    return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
  }

}
