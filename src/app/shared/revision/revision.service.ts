import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { ElementKind } from '../classes/enums';
import { QDDT_QUERY_INFOES } from '../classes/constants';
import { Page } from '../classes/classes';


@Injectable()
export class RevisionService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  public getRevisionByRev(kind: ElementKind, id: string, rev: number): Promise<any>  {

    const qe  = QDDT_QUERY_INFOES.find(e => e.id === kind);
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();

  }

  public getRevisions(elementKind: ElementKind, id: string): Promise<any> {

    const qe = QDDT_QUERY_INFOES.find(e => e.id === elementKind);
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();

  }

  public  getRevisionPage(elementKind: ElementKind, id: string, page: Page): Promise<any> {

    const qe = QDDT_QUERY_INFOES.find(e => e.id === elementKind);
    return this.http.get(this.api + + 'audit/' + qe.path + '/' + id  + '?' +  page.queryPage  ).toPromise();

  }
}
