import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';


@Injectable()
export class RevisionService  {

  readonly pageSize = '&size=10';

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
  }

  getAllRevisions(qddtURI: string): Promise<any> {
    return this.http.get(this.api + qddtURI).toPromise();
  }

  getRevisionPage(qddtURI: string, page: String = '0'): Promise<any> {
    return this.http.get(this.api + qddtURI + '?&page=' + page + this.pageSize ).toPromise();
  }
}
