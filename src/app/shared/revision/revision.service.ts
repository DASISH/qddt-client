import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { ElementKind, QDDT_ELEMENTS } from '../elementinterfaces/elements';


@Injectable()
export class RevisionService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  public getRevisionByRev(kind: ElementKind, id: string, rev: number): Promise<any>  {

    const qe  = QDDT_ELEMENTS.find(e => e.id === kind);
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();

  }

  public getRevisions(elementKind: ElementKind, id: string): Promise<any> {

    const qe = QDDT_ELEMENTS.find(e => e.id === elementKind);
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();

  }

  public  getRevisionPage(elementKind: ElementKind, id: string, page: number = 1): Promise<any> {

    function queryPage (pageNumber: number, size: number = 10 , sorting: String = null): string {
      return '&page=' + pageNumber + '&size=' + size + (sorting) ? '&sort=' + sorting : '';
    }

    const qe = QDDT_ELEMENTS.find(e => e.id === elementKind);
    return this.http.get(this.api + + 'audit/' + qe.path + '/' + id  + '?' +  queryPage(+page, 15, 'desc')  ).toPromise();

  }
}
