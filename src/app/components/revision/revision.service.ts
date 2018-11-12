import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import {ElementKind, getQueryInfo, Page} from '../../classes';


@Injectable()
export class RevisionService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  public getRevisionByRev(kind: ElementKind, id: string, rev: number): Promise<any>  {

    const qe  = getQueryInfo(kind);
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();

  }

  public getRevisions(kind: ElementKind, id: string): Promise<any> {

    const qe  = getQueryInfo(kind);
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();

  }

  public  getRevisionPage(kind: ElementKind, id: string, page: Page): Promise<any> {

    const qe  = getQueryInfo(kind);
    return this.http.get(this.api + + 'audit/' + qe.path + '/' + id  + '?' +  page.queryPage  ).toPromise();

  }
}
