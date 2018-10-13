import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../api';
import { ElementKind, getQueryInfo, IEntityEditAudit, IOtherMaterial} from '../shared/classes';

export function ElementEnumAware(constructor: Function) {
  constructor.prototype.ElementKind = ElementKind;
}


@Injectable()
export class PreviewService {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) {  }

  getElementByKind(kind: ElementKind|string, id: string): Promise<any> {

    const qe = getQueryInfo(kind);
    return this.http.get(this.api  + qe.path + '/' + id ).toPromise();
  }

  getRevisionByKind(kind: ElementKind|string, id: string, rev: number): Promise<any>  {

    const qe = getQueryInfo(kind);
    return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/' + rev).toPromise();
  }

  getRevisionsByKind(kind: ElementKind|string, id: string): Promise<any> {

    const qe = getQueryInfo(kind);
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

  getPdf(element: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(element.classKind);
    if (element.version.revision) {
    return this.http.get(this.api +  'audit/' + qe.path + '/pdf/' + element.id + '/' + element.version.revision
    , { responseType: 'blob'}).toPromise();
    } else {
      return this.http.get(this.api +  qe.path + '/pdf/' + element.id  , { responseType: 'blob'}).toPromise();
    }
  }

  // private getElementKind(kind: string|ElementKind): ElementKind {
  //   return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
  // }
}
