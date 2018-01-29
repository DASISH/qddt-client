import { Observable } from 'rxjs/Observable';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { QddtElements, QddtElement, ElementKind } from '../../preview/preview.service';

@Injectable()
export class CopySourceService {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) {
  }

  getRevisionById(elementTypeId: ElementKind, id: string): Promise<any> {
    const qe: QddtElement = QddtElements.find(e => e.id === elementTypeId);
    if (qe !== undefined) {
      return this.http.get(this.api + 'audit/' + qe.path + '/' + id +'/all').toPromise();
    }
    return Observable.of([]).toPromise();
  }

  getElementByTypeAndName(elementTypeId: ElementKind, name: string) : Promise<any> {
    const qe: QddtElement = QddtElements.find(e => e.id === elementTypeId);
    if (qe !== undefined) {
      return this.http.get(this.api + qe.path + '/page/search/?name=*' + name + '*' ).toPromise();
    }
    return Observable.of([]).toPromise();

  }

  copySource(elementTypeId: ElementKind, fromId: string, fromRev: number, toParentId: string) : Observable<any> {
    const qe: QddtElement = QddtElements.find(e => e.id === elementTypeId);
    return this.http.post(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }
}
