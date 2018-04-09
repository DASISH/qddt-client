import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../api';
import { ElementKind, QDDT_ELEMENTS, ElementRevisionRef, QddtElement } from '../shared/elementinterfaces/elements';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';



export const PUBLICATION_TYPES: QddtElement[] = [
  QDDT_ELEMENTS[ElementKind.TOPIC_GROUP],
  QDDT_ELEMENTS[ElementKind.CONCEPT],
  QDDT_ELEMENTS[ElementKind.QUESTION_ITEM],
  QDDT_ELEMENTS[ElementKind.QUESTION_CONSTRUCT],
  QDDT_ELEMENTS[ElementKind.SEQUENCE_CONSTRUCT],
];


export class Publication  implements  IEntityAudit {
  id: string;
  name: string;
  purpose: string;
  status: PublicationStatus;  // = { id: 0, published: 'NOT_PUBLISHED', label: 'No publication' };  // magic number NOT_PUBLISHED
  classKind = ElementKind[ElementKind.PUBLICATION];
  publicationElements: ElementRevisionRef[];
  constructor() {
    this.publicationElements = [];
  }

}

export class PublicationStatus {
  id: number;
  label: string;
  published: string;
  description?: string;
  children?: PublicationStatus[];

  public constructor(init?: Partial<PublicationStatus>) {
    Object.assign(this, init);
  }
}


@Injectable()
export class PublicationService {

  public PUBLICATION_STATUSES:  Promise<PublicationStatus[]>;

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
    if (!this.PUBLICATION_STATUSES) {
      this.PUBLICATION_STATUSES = this.getPublicationStatus();
    }
  }

  public getPublicationStatusAsList(): Promise<PublicationStatus[]> {
    return new Promise((resolve, reject) => {
      this.PUBLICATION_STATUSES.then((result) => {
        const statusList: PublicationStatus[] = [];
        result.forEach( s => {
          if (s.children) {
            s.children.forEach(s1 =>
              statusList.push(
                new PublicationStatus({id: s1.id, label: s1.label, published: s.published, description: s1.description }) ));
        }
        resolve( statusList); });
      });
  });
  }

  public getPdf(id: string): Promise<Blob> {
    return this.http.get(this.api + 'publication/pdf/' + id, {responseType: 'blob'}).toPromise();
  }

  public searchElements(elementKind: ElementKind, name: string): Promise<any> {
    let query = '?';
    const pt  = PUBLICATION_TYPES.find(qe => qe.id === elementKind);
    if (pt) {
      if (name.length > 0) {
        const fields = pt.fields;
        for (let i = 0; i < fields.length; i++) {
          query += '&' + fields[i] + '=*' + name + '*';
        }
      }
      if (pt.parameter) {
        query += pt.parameter;
      }
      return this.http.get(this.api + pt.path + '/page/search/' + query).toPromise();
    }
    return null;
  }

  public create(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>( this.api + 'publication/create/', publication);
  }

  public update(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>(this.api + 'publication/', publication);
  }

  private getPublicationStatus(): Promise<PublicationStatus[]> {
    return this.http.get<PublicationStatus[]>(this.api + 'publicationstatus/list').toPromise();
  }

}
