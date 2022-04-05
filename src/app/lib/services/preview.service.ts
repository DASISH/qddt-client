import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { ElementKind } from '../enums';
import { getQueryInfo, getElementKind } from '../consts';
import { IEntityEditAudit, IOtherMaterial, IRevisionRef } from '../interfaces';
import { ElementRevisionRefImpl, AbstractControlConstruct, isAbstractControlConstruct, SequenceConstruct } from '../classes';
import { Factory } from '../factory';




@Injectable()
export class PreviewService {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  public getElementByKind(kind: ElementKind | string, id: string): Promise<any> {

    const qe = getQueryInfo(kind);
    return this.http.get(this.api + qe.path + '/' + id).toPromise();
  }

  public getRevisionByKind(kind: ElementKind | string, id: string, rev: number): Promise<IEntityEditAudit> {

    const qe = getQueryInfo(kind);
    return this.http.get<IEntityEditAudit>(this.api + qe.path + '/revision/' + id + ':' + rev).toPromise();
  }

  public getFile(om: IOtherMaterial): Promise<Blob> {
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob' })
      .toPromise();
  }

  public getPdf(item: IRevisionRef): Promise<Blob> {
    let header = new HttpHeaders().set('Accept', 'application/octet-stream');
    let uri = item.elementId + ((item.elementRevision) ? ':' + item.elementRevision : '')

    return this.http.get(this.api + 'othermaterial/pdf/' + uri, { responseType: 'blob', headers: header }).toPromise();
  }


  public async getCtrlRevRefAsync(item: ElementRevisionRefImpl<AbstractControlConstruct>) {
    if (!item.element) {
      const kind = getElementKind(item.elementKind);
      const result = await this.getRevisionByKind(kind, item.elementId, item.elementRevision);
      const element = Factory.createFromSeed(kind, result);
      item.element = isAbstractControlConstruct(element) ? element : null;
      if (this.isSequence(item.element)) {
        const sequencePromises = item.element.sequence
          .map(async (child, _i) =>
            (getElementKind(child.elementKind) === ElementKind.SEQUENCE_CONSTRUCT) ?
              await this.getCtrlRevRefAsync(child) :
              await child);
        item.element.sequence = await Promise.all(sequencePromises);
      }
    }
    // else {
    //   console.debug(item.element || JSON);
    // }
    return item;
  }

  public isSequence(element?: any | SequenceConstruct): element is SequenceConstruct {
    return (element) && (element as SequenceConstruct).sequence !== undefined;
  }
  // private getElementKind(kind: string|ElementKind): ElementKind {
  //   return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
  // }
}
