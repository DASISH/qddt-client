import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../api';
import { ElementKind, QddtElement, QddtElements } from '../preview/preview.service';



export const PUBLICATION_TYPES: QddtElement[] = [
  QddtElements[ElementKind.TOPIC_GROUP],
  QddtElements[ElementKind.CONCEPT],
  QddtElements[ElementKind.QUESTION_ITEM],
  QddtElements[ElementKind.QUESTION_CONSTRUCT],
  QddtElements[ElementKind.SEQUENCE_CONSTRUCT],
];

export class PublicationElement {
  elementId: string;
  elementKind: ElementKind;
  elementRevision: number;
  name: string;
  version: any;
  element: any;
}

export class Publication {
  id: string;
  name: string;
  purpose: string;
  status: string;
  publicationElements: PublicationElement[];
  constructor() {
    this.publicationElements = [];
  }
}

export class PublicationStatus {
  id: number;
  name: string;
  label: string;
  description: string;
  children?: PublicationStatus[];

  public constructor(init?: Partial<PublicationStatus>) {
    Object.assign(this, init);
  }
}




@Injectable()
export class PublicationService {

  public readonly PUBLICATION_STATUSES: PublicationStatus[] = [];
  private readonly statusList: PublicationStatus[] = [];

  readonly pageSize = '&size=15';

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
    if (this.PUBLICATION_STATUSES.length === 0) {
      this.getPublicationStatus().then(
        result => {
          this.PUBLICATION_STATUSES.push(result);
          this.PUBLICATION_STATUSES.forEach( s => {
            this.statusList.push( new PublicationStatus( {id: s.id, label: s.label, name: s.name, description: s.description } ) );
            if (s.children && s.children.length > 0) {
              s.children.forEach(s1 =>
                this.statusList.push( new PublicationStatus( {id: s1.id, label: s1.label, name: s1.name, description: s1.description }) ) );
            }
          });
        },
        error => {  throw error; });
    }
  }

  getByTopic(topicId: string): Promise<any> {
    return this.http.get(this.api + 'concept/page/by-topicgroup/' + topicId + '?page=0&size=50&sort=asc')
      .toPromise();
  }

  getElementRevisions(elementKind: ElementKind, id: string): Promise<any> {
    const e: any = PUBLICATION_TYPES.find(qe => qe.id === elementKind);
    if (e !== undefined) {
      if (elementKind === ElementKind.CONCEPT || elementKind === ElementKind.TOPIC_GROUP) {
        return this.http.get(this.api + 'audit/' + e.path + '/' + id + '/allinclatest').toPromise();
      } else {
        return this.http.get(this.api + 'audit/' + e.path + '/' + id + '/all').toPromise();
      }
    }
    return new Promise(null);
  }

  getQuestionitem(id: string): Promise<any> {
    return this.http.get(this.api + 'questionitem/' + id).toPromise();
  }

  getAll(page: String = '0'): Promise<any> {
    return this.http.get(this.api + 'publication/page/' + this.pageSize).toPromise();
  }

  getPublication(id: string): Promise<any> {
    return this.http.get(this.api + 'publication/' + id).toPromise();
  }

  public getPublicationStatusAsList(): PublicationStatus[] {
    return this.statusList;
  }

  getStatusByName(name: String): PublicationStatus {
    return this.getPublicationStatusAsList().find(e => e.name === name );
  }

  getStatusById(id: number): PublicationStatus {
    return this.getPublicationStatusAsList().find(e => e.id === id );
  }


  searchPublications(name: string = '', page: String = '0', sort: String = ''): Promise<any> {
    const queries: any[] = [];
    if (name.length > 0) {
      queries.push('name=' + '*' + name + '*' + '&status=' + '*' + name + '*');
    }
    if (sort.length > 0) {
      queries.push('sort=' + sort);
    }
    if (page !== '0') {
      queries.push('page=' + page);
    }
    let query = '';
    if (queries.length > 0) {
      query = '?' + queries.join('&');
    }
    return this.http.get(this.api + 'publication/page/search/' + query).toPromise();
  }

  searchElements(elementKind: ElementKind, name: string): Promise<any> {
    let query = '?';
    const e: any = PUBLICATION_TYPES.find(qe => qe.id === elementKind);
    if (e !== undefined) {
      if (name.length > 0) {
        const fields: any[] = e.fields;
        for (let i = 0; i < fields.length; i++) {
          query += '&' + fields[i] + '=*' + name + '*';
        }
      }
      if (e.parameter) {
        query += e.parameter;
      }
      return this.http.get(this.api + e.path + '/page/search/' + query).toPromise();
    }
    return null;
  }

  getFile(id: string): Promise<Blob> {
    return this.http.get(this.api + 'othermaterial/files/' + id, {responseType: 'blob'})
      .toPromise();
  }

  getPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'publication/pdf/' + id, {responseType: 'blob'})
      .toPromise();
  }

  create(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>( this.api + 'publication/create/', publication);
  }

  update(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>(this.api + 'publication/', publication);
  }


  private getPublicationStatus(): Promise<PublicationStatus> {
    return this.http.get<PublicationStatus>(this.api + 'publicationstatus/list').toPromise();
  }

}
