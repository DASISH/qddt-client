import {Inject, Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';
import { UserService} from '../core/services';
import { API_BASE_HREF} from '../../api';
import {
  ActionKind,
  ElementKind,
  getQueryInfo, IEntityAudit,
  IEntityEditAudit,
  IOtherMaterial,
  IPageResult, IRevisionResult, QueryInfo
} from '../../classes';


@Injectable()
export class HomeService<T extends IEntityEditAudit>  {

  private readonly __canDo: Map<ElementKind, Map<ActionKind, boolean>>;
  private __qe: QueryInfo;
  constructor( private userService: UserService, protected http: HttpClient,
               @Inject(API_BASE_HREF) protected api: string) {

    this.__canDo = new Map<ElementKind, Map<ActionKind, boolean>>([
      [ElementKind.CONCEPT, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.CONCEPT) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.CONCEPT) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.CONCEPT) ]
      ])],
      [ElementKind.TOPIC_GROUP, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.TOPIC_GROUP) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.TOPIC_GROUP) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.TOPIC_GROUP) ]
      ])],
      [ElementKind.STUDY, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.STUDY) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.STUDY) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.STUDY) ]
      ])],
      [ElementKind.SURVEY_PROGRAM, new Map<ActionKind, boolean>([
        [ ActionKind.Create, userService.canDo(ActionKind.Create, ElementKind.SURVEY_PROGRAM) ],
        [ ActionKind.Update, userService.canDo(ActionKind.Update, ElementKind.SURVEY_PROGRAM) ],
        [ ActionKind.Delete, userService.canDo(ActionKind.Delete, ElementKind.SURVEY_PROGRAM) ]
      ])]
    ]);
  }


  getRevisionsById<S extends IEntityAudit>(elementKind: ElementKind, id: string): Promise<IPageResult<IRevisionResult<S>>>  {
    const qe = getQueryInfo(elementKind);
    if (qe.id === ElementKind.CONCEPT || qe.id === ElementKind.TOPIC_GROUP) {
      return this.http.get<IPageResult<IRevisionResult<S>>>
      (this.api + 'audit/' + qe.path + '/' + id + '/allinclatest').toPromise();
    } else {
      return this.http.get<IPageResult<IRevisionResult<S>>>
      (this.api + 'audit/' + qe.path + '/' + id + '/all').toPromise();
    }
    return new Promise(null);
  }

  getElementByName<S extends IEntityAudit>(elementKind: ElementKind, name: string): Promise<IPageResult<S>> {
    const qe = getQueryInfo(elementKind);
    return this.http.get<IPageResult<S>>(this.api + qe.path + '/page/search/?name=*' + name + '*' ).toPromise();
  }

  copySource<S extends IEntityAudit>(elementKind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<S> {
    const qe = getQueryInfo(elementKind);
    return this.http.post<S>(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  create(item: T, parentId?: string): Observable<T> {
    const qe = getQueryInfo(item.classKind);
    return  (parentId) ? this.http.post<T>(this.api + qe.path + '/create/' + parentId , item) :
      this.http.post<T>(this.api + qe.path + '/create'  , item);
  }

  update(item: T): Observable<T> {
    const qe = getQueryInfo(item.classKind);
    return this.http.post<T>(this.api + qe.path, item);
  }

  updateAll(items: T[], parentId?: string, ): Observable<T[]> {
    const qe = getQueryInfo(items[0].classKind);
    return (parentId) ? this.http.post<T[]>(this.api + qe.path + '/list/' + parentId, items) :
      this.http.post<T[]>(this.api + qe.path + '/list', items);
  }

  updateWithFiles(form: FormData ): Observable<T> {
    console.log('updateWithFiles');
    return this.http.post<T>( this.api +  this.qe.path + '/createfile/', form, { reportProgress: true} );
  }

  delete( id: string): Observable<any> {
    return this.http.delete(this.api + this.qe.path + '/delete/' + id, {responseType: 'text'});
  }

  getPdf(element: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(element.classKind);
    return this.http.get(this.api +  qe.path + '/pdf/' + element.id, { responseType: 'blob'})
      .toPromise();
  }

  get canDo(): Map<ActionKind, boolean> {
    return this.__canDo.get(this.qe.id);
  }

  get qe() {
    return this.__qe;
  }

  set qe(queryInfo: QueryInfo) {
    this.__qe = queryInfo;
  }

  getXml(element: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(element.classKind);
    return this.http.get(this.api +  qe.path + '/xml/' + element.id, { responseType: 'blob'})
      .toPromise();
  }

  getFile(om: IOtherMaterial): Promise<Blob> {
    // /files/{root}/{filename}
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob'})
      .toPromise();
  }

  async get(id: string) {
    return await this.http.get<T>(this.api + this.qe.path + '/' + id).toPromise();
  }

  async getExt<S extends IEntityAudit>(elementKind: ElementKind, id: string) {
    const qe = getQueryInfo(elementKind);
    return await this.http.get<S>(this.api + qe.path + '/' + id).toPromise();
  }

  /// Only for Concept
  getPageByParent(parentId: string): Promise<IPageResult<T>> {
    return (parentId) ? this.http.get<IPageResult<T>>(this.api + this.qe.path + '/page/by-parent/' + parentId).toPromise() :
      this.http.get<IPageResult<T>>(this.api + this.qe.path + '/page').toPromise();
  }

  getListByParent(parentId?: string): Promise<T[]> {
    return (parentId) ?  this.http.get<T[]>(this.api + this.qe.path + '/list/by-parent/' + parentId).toPromise() :
      this.http.get<T[]>(this.api + this.qe.path + '/list').toPromise();
  }

  attachQuestion( id: string, questionId: string, revision: number): Observable<T> {
    if (revision === null) {
      revision = 0;
    }
    return this.http.post<T>(this.api +  this.qe.path + '/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision + '&parentId=' + id , {});
  }

  deattachQuestion(id: string, questionId: string, revision: number): Observable<T> {
    return this.http.post<T>(this.api +  this.qe.path + '/decombine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision +
      '&parentId=' + id, {});
  }

}
