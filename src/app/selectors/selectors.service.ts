import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ElementKind, QDDT_ELEMENTS } from '../shared/elementinterfaces/elements';

@Injectable()
export class SelectorsService {

  readonly pageSize = '&size=10';

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  public searchItems(kind: ElementKind, searchString: string = '',  page: string = '0', sort: string = ''): Promise<any> {
    const qe = QDDT_ELEMENTS.find(e => e.id === kind);
    const args = searchString.split(' ,');
    const queries = [];

    if (args.length === qe.fields.length) {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=*' + args[i] + '*' );
      }
    } else {
      for (let i = 0; i < qe.fields.length; i++) {
        queries.push(qe.fields[i] + '=*' + searchString + '*' );
      }
    }

    if (sort.length > 0) { queries.push('sort=' + sort); }
    if (page !== '0') { queries.push('page=' + page); }

    let query = '';
    if (queries.length > 0) { query = '?' + queries.join('&'); }

    if (qe.parameter) {
      query += qe.parameter;
    }

    return this.http.get(this.api + qe.path + '/page/search/' + query).toPromise();
  }

  public getElementRevisions(kind: ElementKind, id: string): Promise<any> {
    const qe = QDDT_ELEMENTS.find(e => e.id === kind);
    if (qe) {
      if (kind === ElementKind.CONCEPT || kind === ElementKind.TOPIC_GROUP) {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
      } else {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
      }
    }
    return new Promise(null);
  }
}

