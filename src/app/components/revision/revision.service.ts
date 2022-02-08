import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { API_BASE_HREF } from '../../api';
import { ElementKind, getQueryInfo, HalResource, Page } from '../../lib';


@Injectable()
export class RevisionService {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }
  // revisions/surveyprogram
  public getRevisionByRev(kind: ElementKind, id: string, rev: number): Promise<any> {

    const qe = getQueryInfo(kind);
    return this.http.get<HalResource>(this.api + qe.path + '/revision/' + id + ':' + rev).toPromise();

  }

  public getRevisions(kind: ElementKind, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const qe = getQueryInfo(kind);
      this.http.get<HalResource>(this.api + qe.path + '/revisions/' + id).toPromise()
        .then(
          async result => resolve(result._embedded[qe.halName]),
          err => reject(err)
        );
    });

  }

  public getRevisionPage(kind: ElementKind, id: string, page: Page): Promise<any> {
    return new Promise((resolve, reject) => {
      const qe = getQueryInfo(kind);
      this.http.get<HalResource>(this.api + qe.path + '/revisions/' + id + '?' + page.queryPage).toPromise()
        .then(
          async result => resolve(result._embedded[qe.halName]),
          err => reject(err)
        );
    });

  }
}
