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

  public searchItems(kind: ElementKind, searchString: string = '',  page: Page): Promise<any> {
    const qe = QDDT_ELEMENTS.find(e => e.id === kind);
    const args = searchString.trim().split(' ');
    const queries = [];

    console.log(args);
    console.log(args.length === qe.fields.length);

    if (args.length === qe.fields.length) {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=*' + args[i] + '*' );
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=*' + searchString + '*' );
      }
    }

    queries.push(page.queryPage());

    let query = '';
    if (queries.length > 0) { query = '?' + queries.join('&'); }

    if (qe.parameter) {
      query += qe.parameter;
    }

    return this.http.get(this.api + qe.path + '/page/search/' + query).toPromise();
  }

  public getItem(kind: ElementKind, id: string ): Promise<IEntityEditAudit> {
    const qe = QDDT_ELEMENTS.find(e => e.id === kind);
    return this.http.get<IEntityEditAudit>(this.api + qe.path + '/' + id).toPromise();
  }

  public getPdf(item: IEntityEditAudit): Promise<Blob>  {
    const kind = ElementKind[item.classKind];
    const qe = QDDT_ELEMENTS.find(e => e.id === kind);
    return this.http.get(this.api + qe.path + '/pdf/' + item.id, { responseType: 'blob'}).toPromise();
  }

  public delete(item: IEntityEditAudit): Observable<any> {
    const kind = ElementKind[item.classKind];
    const qe = QDDT_ELEMENTS.find(e => e.id === kind);
    return this.http.delete(this.api + qe.path + '/delete/' + item.id);
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

}

