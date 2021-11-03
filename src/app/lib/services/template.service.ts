import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { API_BASE_HREF } from '../../api';
import { UserService } from './user.service';
import { IEntityAudit, IEntityEditAudit, IPageResult, IPageSearch, IRevisionResult, IOtherMaterial, HalResource } from '../interfaces';
import { ElementKind, ActionKind } from '../enums';
import { getQueryInfo, getElementKind } from '../consts';
import { Agency, PageSearch } from '../classes';
import { Factory } from '../factory';



@Injectable()
export class TemplateService {

  private padAsterisk = (source: String) => {
    console.log(source.charAt(source.length - 1));
    if (source.charAt(source.length - 1) == "*")
      return source;
    return source + "*";
  }

  constructor(protected http: HttpClient, private userService: UserService, @Inject(API_BASE_HREF) protected api: string) {
    // console.debug('TemplateService::CONST ' + api);
  }

  public searchByUuid(id: string): Promise<any> {
    return this.http.get(this.api + 'preview/' + id).toPromise();
  }

  public searchByKind<T extends IEntityAudit>(pageSearch: IPageSearch): Promise<IPageResult> {
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
            console.log(key[0] + '=' + key[1]);
            queries.push(key[0] + '=' + key[1]);
          });
      }
    } else {
      if (pageSearch.keys) {
        pageSearch.keys.forEach((value, key) => (value) ? queries.push(key + '=' + value) : '');
      }
    }
    const xmlLang = ((pageSearch.xmlLang) && pageSearch.xmlLang !== 'none') ? pageSearch.xmlLang : '*';
    queries.push('xmlLang=' + xmlLang);

    let query = '?';

    if (queries.length > 0) { query = '?' + queries.join('&'); }

    query += pageSearch.page.queryPage();

    if (qe.parameter) { query += qe.parameter; }

    if (pageSearch.sort) { query += '&sort=' + pageSearch.sort; }

    console.log(query);

    return this.http.get<IPageResult>(this.api + qe.path + '/search/findByQuery' + query).toPromise();
  }

  public getByKindEntity<T extends IEntityEditAudit>(kind: ElementKind, id: string): Promise<T> {
    const qe = getQueryInfo(kind);
    return new Promise<T>((resolve, reject) => {
      this.http.get<T>(this.api + qe.path + '/' + id).toPromise()
        .then(async (result: T) => {
          if (!(result._embedded)) {
            console.log(result._embedded)
            result._embedded = {};
          }
          if (!(result._embedded.agency) && (result.agencyId))
            result._embedded.agency = await this.getAgency(result.agencyId);
          if (!(result._embedded.modifiedBy) && (result.modifiedById))
            result._embedded.modifiedBy = await this.getUser(result.modifiedById)
          // Success
          resolve(result);
        },
          err => {
            // Error
            reject(err);
          }
        );
    });

  }
  public getByKindRevisions<T extends IEntityAudit>(kind: ElementKind, id: string): Promise<IPageResult> {
    const qe = getQueryInfo(kind);
    if (qe) {
      // if (kind === ElementKind.CONCEPT || kind === ElementKind.TOPIC_GROUP) {
      //   return this.http.get<IPageResult>
      //     (this.api + '/' + qe.path + '/' + id + '/revisions').toPromise();
      // } else {
      return this.http.get<IPageResult>(this.api + qe.path + '/' + id + '/revisions').toPromise();
      // }
    }
    return new Promise(null);
  }

  public getByKindRevision(kind: ElementKind, id: string, rev?: number): Promise<IEntityEditAudit> {
    const qe = getQueryInfo(kind);
    if (rev) {
      return this.http.get<IEntityEditAudit>(this.api + qe.path + '/' + id + ':' + rev).toPromise();
    }
    return this.http.get<IEntityEditAudit>(this.api + qe.path + '/' + id).toPromise();

  }

  public getLatestVersionByKindEntity<T extends IEntityEditAudit>(kind: ElementKind, id: string): Promise<IRevisionResult<T>> {
    const qe = getQueryInfo(kind);
    return this.http.get<IRevisionResult<T>>(this.api + 'audit/' + qe.path + '/' + id + '/latestversion').toPromise();
  }

  public create<T extends IEntityAudit>(item: T, parentId?: string): Observable<T> {
    const qe = getQueryInfo(item.classKind);
    return ((parentId) ?
      this.http.put<HalResource>(this.api + qe.parentPath + '/' + parentId + '/children', item) :
      this.http.post<HalResource>(this.api + qe.path, item))
      .pipe(map(response => Factory.createFromSeed(item.classKind, response._embedded) as T));

  }

  public copySource<T extends IEntityAudit>(elementKind: ElementKind, fromId: string, fromRev: number, toParentId: string): Observable<T> {
    const qe = getQueryInfo(elementKind);
    return this.http.post<T>(this.api + qe.path + '/copy/' + fromId + '/' + fromRev + '/' + toParentId, {});
  }

  public update<T extends IEntityAudit>(item: IEntityAudit): Observable<T> {
    const kind = getElementKind(item.classKind);
    const qe = getQueryInfo(kind);
    if (item.id === item['basedOnObject']) {
      item.id = null;
      /// TODO fix patch to post
      console.debug(item);
    }
    let path2 = '';
    if (qe.path === 'controlconstruct') { // silly exception to the simple rule
      if (kind === ElementKind.QUESTION_CONSTRUCT) {
        path2 = '/question';
      } else if (kind === ElementKind.SEQUENCE_CONSTRUCT) {
        path2 = '/sequence';
      } else if (kind === ElementKind.CONDITION_CONSTRUCT) {
        path2 = '/condition';
      } else if (kind === ElementKind.STATEMENT_CONSTRUCT) {
        path2 = '/statement';
      }
    }
    return this.http.patch<HalResource>(this.api + qe.path + path2 + '/' + item.id, item)
      .pipe(map(response => Factory.createFromSeed(item.classKind, response._embedded) as T));
  }

  // public updateAll<T extends IEntityAudit>(items: T[], parentId?: string,): Observable<T[]> {
  //   const qe = getQueryInfo(items[0].classKind);
  //   return (parentId) ? this.http.post<T[]>(this.api + qe.path + '/list/' + parentId, items) :
  //     this.http.post<HalResource[]>(this.api + qe.path + '/list', items)
  //     .pipe(map(response => Factory.createFromSeed(item.classKind, response._embedded) as T));

  // }

  public updateWithFiles(kind: ElementKind, form: FormData): Observable<any> {
    const qe = getQueryInfo(kind);
    return this.http.post(this.api + qe.path + '/createfile/', form, { reportProgress: true });
  }

  public delete(item: IEntityAudit): Observable<any> {
    // console.debug(item || JSON);
    const qe = getQueryInfo(item.classKind);
    return this.http.delete(this.api + qe.path + '/delete/' + item.id);
  }

  public getPdf(item: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(item.classKind);
    let header = new HttpHeaders()
      .set('Accept', 'application/pdf');

    return this.http.get(this.api + qe.path + '/' + item.id, { responseType: 'blob', headers: header }).toPromise();
  }

  public getXML(item: IEntityEditAudit): Promise<Blob> {
    const qe = getQueryInfo(item.classKind);
    return this.http.get(this.api + qe.path + '/' + item.id, { responseType: 'blob' }).toPromise();
  }

  public getFile(om: IOtherMaterial): Promise<Blob> {
    return this.http.get(this.api + 'othermaterial/files/' + om.originalOwner + '/' + om.fileName, { responseType: 'blob' }).toPromise();
  }

  public can(action: ActionKind, kind: ElementKind): boolean {
    return this.userService.canDo(action, kind);
  }

  public async canDoAction(action: ActionKind, entity: IEntityEditAudit) {
    return this.userService.canDo(action, getElementKind(entity.classKind)) && (await this.hasOwnerRights(entity.agency));
  }

  public async hasOwnerRights(entityAgency?: Agency) {
    return (entityAgency) ? ((await this.userService.getCurrentAgency()).id === entityAgency.id) : true;
  }

  public async getAgency(uuid: string) {
    let result = await this.userService.getAgencies();
    return result.find(pre => pre.id == uuid)
  }
  public async getUser(modifiedById: string) {
    return await this.userService.getUser(modifiedById);
  }

}

