import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { ElementKind } from '../enums';
import { getQueryInfo, getElementKind } from '../consts';
import { IEntityEditAudit, IOtherMaterial, IRevisionResult } from '../interfaces';
import { ElementRevisionRefImpl, AbstractControlConstruct, isAbstractControlConstruct, SequenceConstruct } from '../classes';
import { Factory } from '../factory';




@Injectable()
export class PreviewService {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  public getElementByKind(kind: ElementKind | string, id: string): Promise<any> {

    const qe = getQueryInfo(kind);
    return this.http.get(this.api + qe.path + '/' + id).toPromise();
  }

  public getRevisionByKind(kind: ElementKind | string, id: string, rev: number): Promise<IRevisionResult<IEntityEditAudit>> {

    const qe = getQueryInfo(kind);
    return this.http.get<IRevisionResult<IEntityEditAudit>>(this.api + '/' + qe.path + '/' + id + ':' + rev).toPromise();
  }

  // public getRevisionsByKind(kind: ElementKind | string, id: string): Promise<any> {
  //
  //   const qe = getQueryInfo(kind);
  //   if (qe) {
  //     if (kind === ElementKind.CONCEPT || kind === ElementKind.TOPIC_GROUP) {
  //       return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
  //     } else {
  //       return this.http.get(this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
  //     }
  //   }
  //   return new Promise(null);
  // }

  public getFile(om: IOtherMaterial): Promise<Blob> {
    // /files/{root}/{filename}
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob' })
      .toPromise();
  }

  public getPdf(element: IEntityEditAudit): Promise<Blob> {
    // @ts-ignore
    const qe = getQueryInfo(element.classKind || element.refKind);
    // @ts-ignore
    const revision = element.refRev || element.version.revision;
    if (revision) {
      return this.http.get(this.api + '/' + qe.path + '/' + element.id + ':' + element.version.revision + '/pdf'
        , { responseType: 'blob' }).toPromise();
    } else {
      return this.http.get(this.api + '/' + qe.path + '/' + element.id + '/pdf', { responseType: 'blob' }).toPromise();
    }
  }

  public async getCtrlRevRefAsync(item: ElementRevisionRefImpl<AbstractControlConstruct>) {
    if (!item.element) {
      const kind = getElementKind(item.elementKind);
      const result = await this.getRevisionByKind(kind, item.elementId, item.elementRevision);
      const element = Factory.createFromSeed(kind, result.entity);
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
