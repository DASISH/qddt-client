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

  getRevisionPage(qddtURI: string, page: String = '0'):  Promise<any> {
    return this.http.get(this.api + qddtURI + '?&page=' + page + this.pageSize ).toPromise();
  }

  // getelement(type: string, id: string, rev: string):  Promise<any> {
  //   if ( type === 'survey') {
  //     return this.http.get('audit/surveyprogram/' + id + '/' + rev).toPromise();
  //   } else if ( type === 'category') {
  //     return this.http.get('audit/category/' + id + '/' + rev).toPromise();
  //   } else if ( type === 'controlconstruct') {
  //     return this.http.get('audit/controlconstruct/' + id + '/' + rev).toPromise();
  //   } else if ( type === 'concept') {
  //     return this.http.get('audit/concept/' + id + '/' + rev).toPromise();
  //   }
  //   return new Promise<any>({});
  // }

}
