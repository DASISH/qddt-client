import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { API_BASE_HREF } from '../api';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import { ElementKind} from '../shared/classes/enums';
import {IEntityAudit, IRevisionResultEntity, IPageResult, IComment} from '../shared/classes/interfaces';
import { ElementRevisionRef, QueryInfo} from '../shared/classes/classes';
import {Publication, PUBLICATION_TYPES, PublicationStatus} from './publication.classes';


@Injectable()
export class PublicationService {

  public PUBLICATION_STATUSES:  Promise<PublicationStatus[]>;

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
    if (!this.PUBLICATION_STATUSES) {
      this.PUBLICATION_STATUSES = this.getPublicationStatus();
    }
  }

  public update(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>(this.api + 'publication/', publication);
  }

  private getPublicationStatus(): Promise<PublicationStatus[]> {
    return this.http.get<PublicationStatus[]>(this.api + 'publicationstatus/list').toPromise();
  }

}
