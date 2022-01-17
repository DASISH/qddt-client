import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { ElementKind, getQueryInfo, Page } from '../../lib';


@Injectable()
export class RevisionService {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }
  // revisions/surveyprogram
  public getRevisionByRev(kind: ElementKind, id: string, rev: number): Promise<any> {

    const qe = getQueryInfo(kind);
    return this.http.get(this.api + qe.path + '/' + id + ':' + rev).toPromise();

  }

  public getRevisions(kind: ElementKind, id: string): Promise<any> {

    const qe = getQueryInfo(kind);
    return this.http.get(this.api + qe.path + '/revisions/' + id).toPromise();

  }

  public getRevisionPage(kind: ElementKind, id: string, page: Page): Promise<any> {

    const qe = getQueryInfo(kind);
    return this.http.get(this.api + '' + qe.path + '/revisions/' + id + '?' + page.queryPage).toPromise();

  }
}
