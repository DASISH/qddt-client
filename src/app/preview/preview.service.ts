import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ElementKind } from '../shared/classes/enums';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import { IOtherMaterial } from '../shared/classes/interfaces';

export function ElementEnumAware(constructor: Function) {
  constructor.prototype.ElementKind = ElementKind;
}


@Injectable()
export class PreviewService {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) {  }

  getElementByKind(kind: ElementKind, id: string): Promise<any> {

    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.get(this.api  + qe.path + '/' + id ).toPromise();
  }

  getRevisionByKind(kind: ElementKind, id: string, rev: number): Promise<any>  {

    const qe = QDDT_QUERY_INFOES[kind];
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();
  }

  getRevisionsByKind(kind: ElementKind, id: string): Promise<any> {

    const qe = QDDT_QUERY_INFOES[kind];
    if (qe) {
      if (kind === ElementKind.CONCEPT || kind === ElementKind.TOPIC_GROUP) {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
      } else {
        return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
      }
    }
    return new Promise(null);
  }

  getFile(om: IOtherMaterial): Promise<Blob> {
    // /files/{root}/{filename}
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob'})
      .toPromise();
  }

}
