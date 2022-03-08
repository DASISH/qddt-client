import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_HREF } from '../../api';
import { UserService } from './user.service';
import { IEntityAudit, IEntityEditAudit, IPageResult, IPageSearch, IOtherMaterial, HalResource } from '../interfaces';
import { ElementKind, ActionKind } from '../enums';
import { getQueryInfo, getElementKind } from '../consts';
import { Agency, PageSearch, QueryInfo } from '../classes';
import { Factory } from '../factory';
import { HalLink } from '../interfaces/http.interfaces';



@Injectable()
export class TemplateService {

  private padAsterisk = (source: string) => {
    console.debug(source.charAt(source.length - 1));
    if (source.charAt(source.length - 1) == "*")
      return source;
    return source + "*";
  }

  constructor(protected http: HttpClient, private userService: UserService, @Inject(API_BASE_HREF) protected api: string) { }

  public searchByUuid(id: string): Promise<any> {
    return this.http.get(this.api + 'search/' + id).toPromise();
  }

  public async searchByKind<T extends IEntityAudit>(pageSearch: IPageSearch): Promise<IPageResult> {
    pageSearch = new PageSearch(pageSearch);
    const qe = getQueryInfo(pageSearch.kind);
    const queries = [];

    if (!pageSearch.hasDetailSearch) {
      for (const field of qe.fields) {
        queries.push(field + '=' + this.padAsterisk(pageSearch.key.trim()));
      }
      if (pageSearch.keys) {
        Array.from(pageSearch.keys)
          .filter((item) => !qe.fields.includes(item[0], 0))
          .forEach(key => {
            console.debug(key[0] + '=' + key[1]);
            queries.push(key[0] + '=' + key[1]);
          });
      }
    } else {
      if (pageSearch.keys) {
        pageSearch.keys.forEach((value, key) => (value) ? queries.push(key + '=' + value) : '');
      }
    }
    const xmlLang = ((pageSearch.xmlLang) && pageSearch.xmlLang !== 'none') ? pageSearch.xmlLang : (await this.userService.getCurrentXmlLang());
    queries.push('xmlLang=' + xmlLang);

    let query = '?';

    if (queries.length > 0) { query = '?' + queries.join('&'); }

    query += pageSearch.page.queryPage();

    if (qe.parameter) { query += qe.parameter; }

    if (pageSearch.sort) { query += '&sort=' + pageSearch.sort; }

    console.debug(query);

    let customPath = ((qe.id === ElementKind.QUESTION_CONSTRUCT) ||
      (qe.id === ElementKind.SEQUENCE_CONSTRUCT) ||
      (qe.id === ElementKind.CONDITION_CONSTRUCT) ||
      (qe.id === ElementKind.STATEMENT_CONSTRUCT))
      ? "controlconstruct" : qe.path

    return this.http.get<IPageResult>(this.api + customPath + '/search/findByQuery' + query).toPromise();
  }

  public getByKindEntity<T extends IEntityEditAudit>(kind: ElementKind, id: string): Promise<T> {
    const qe = getQueryInfo(kind);

    return new Promise<T>((resolve, reject) => {
      this.http.get<T>(this.api + qe.path + '/' + id).toPromise()
        .then(async (result: T) => {
          if (!(result._embedded)) {
            result._embedded = {};
          }
          resolve(Factory.createFromSeed(kind, result) as T);
        },
          err => {
            // Error
            reject(err);
          }
        );
    });

  }

  public getByKindRevisions<T extends IEntityAudit>(kind: ElementKind, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const qe = getQueryInfo(kind);
      this.http.get<HalResource>(this.api + qe.path + '/revisions/' + id).toPromise()
        .then(
          async result => resolve(result._embedded[qe.halName]),
          err => reject(err)
        );
    });
  }

  public getByKindRevision(kind: ElementKind, id: string, rev?: number): Promise<IEntityEditAudit> {
    const qe = getQueryInfo(kind);
    if (rev) {
      return this.http.get<IEntityEditAudit>(this.api + qe.path + '/revision/' + id + ':' + rev).toPromise();
    }
    return this.http.get<IEntityEditAudit>(this.api + qe.path + '/' + id).toPromise();

  }

  public getLatestVersionByKindEntity<T extends IEntityEditAudit>(kind: ElementKind, id: string): Promise<T> {
    const qe = getQueryInfo(kind);
    return this.http.get<T>(this.api + 'audit/' + qe.path + '/' + id + '/latestversion').toPromise();
  }

  public create<T extends IEntityAudit>(item: T, parentId?: string, putUrl?: string): Observable<T> {
    const qe = getQueryInfo(item.classKind);
    const kind = getElementKind(item.classKind);
    let customPath = this.path2(qe)

    return (
      (parentId) ? this.http.put<HalResource>(this.api + qe.parentPath + '/' + parentId + '/children', item) :
        ((putUrl) ? this.http.put<HalResource>(putUrl, item) :
          this.http.post<HalResource>(this.api + qe.path, item)))
      .pipe(map(response => Factory.createFromSeed(item.classKind, response) as T));

  }

  public copySource<T extends IEntityAudit>(elementKind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<T> {
    const qe = getQueryInfo(elementKind);
    return this.http.post<T>(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  public update<T extends IEntityAudit>(item: T, parentId?: string): Observable<T> {
    if (!(item.id))
      return this.create<T>(item, parentId)
    const kind = getElementKind(item.classKind);
    const qe = getQueryInfo(kind);
    if (item.id === item.basedOn?.id) {
      item.id = null;
      /// TODO fix patch to post
      console.debug(item);
    }
    let path2 = this.path2(qe)

    return this.http.put<HalResource>((item._links.self as HalLink).href, item)
      .pipe(map(response => Factory.createFromSeed(item.classKind, response) as T));
  }


  public updateWithFiles(kind: ElementKind, form: FormData): Observable<any> {
    const qe = getQueryInfo(kind);
    return this.http.post(this.api + qe.path + '/createfile/', form, { reportProgress: true });
  }

  public delete(item: IEntityAudit): Observable<any> {
    // console.debug(item || JSON);
    const qe = getQueryInfo(item.classKind);
    return this.http.delete(this.api + qe.path + '/' + item.id);
  }

  public getPdf(item: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(item.classKind);
    // let header = new HttpHeaders()
    // .set('Accept', 'application/pdf');
    let header = new HttpHeaders()
      .set('Accept', 'application/octet-stream');

    return this.http.get(this.api + qe.path + '/pdf/' + item.id, { responseType: 'blob', headers: header }).toPromise();
  }

  public getXML(item: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(item.classKind);
    let header = new HttpHeaders()
      .set('Accept', 'text/xml');

    return this.http.get(this.api + qe.path + '/xml/' + item.id, { responseType: 'blob', headers: header }).toPromise();
  }

  public getFile(om: IOtherMaterial): Promise<Blob> {
    let header = new HttpHeaders()
      .set('Accept', 'application/octet-stream');
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob', headers: header }).toPromise();
  }

  public upload(parentId: string, file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.api}topicgroup/${parentId}/otherMaterial`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  public deleteFile(otherMaterial: IOtherMaterial): Promise<any> {
    return this.http.delete(`${this.api}topicgroup/${otherMaterial.originalOwner}/otherMaterial/${otherMaterial.fileName}`).toPromise();
  }


  public uploadFile(parentId: string, file: FormData): Observable<any> {
    let header = new HttpHeaders()
      .set('Accept', 'application/hal+json')
      .set('Content-Type', 'multipart/form-data');
    return this.http.post(this.api + 'topicgroup/' + parentId + '/otherMaterial', file, { reportProgress: true, headers: header });
  }


  public can(action: ActionKind, kind: ElementKind): boolean {
    return this.userService.canDo(action, kind);
  }

  public async canDoAction(action: ActionKind, entity: IEntityEditAudit) {
    return this.userService.canDo(action, getElementKind(entity.classKind)) && (this.hasOwnerRights(entity.agency));
  }

  public async hasOwnerRights(entityAgency?: Agency) {
    return (entityAgency) ? ((await this.userService.getCurrentAgency()).id === entityAgency.id) : true;
  }

  public async getAgency(uuid: string) {
    let result = await this.userService.getAgencies();
    return result.find(pre => pre.id == uuid)
  }
  public async getUser(modifiedById: string) {
    return this.userService.getUser(modifiedById);
  }

  private path2(qe: QueryInfo) {
    let path2 = ''
    if (qe.path === 'controlconstruct') { // silly exception to the simple rule
      if (qe.id === ElementKind.QUESTION_CONSTRUCT) {
        path2 = '/question';
      } else if (qe.id === ElementKind.SEQUENCE_CONSTRUCT) {
        path2 = '/sequence';
      } else if (qe.id === ElementKind.CONDITION_CONSTRUCT) {
        path2 = '/condition';
      } else if (qe.id === ElementKind.STATEMENT_CONSTRUCT) {
        path2 = '/statement';
      }
    }
    return path2
  }

}

