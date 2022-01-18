import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../../api';
import { Publication, PublicationStatus} from '../classes';
import {PropertyStoreService} from './property.service';
import { HalResource } from '../interfaces/http.interfaces';


@Injectable()
export class PublicationService {

  constructor(protected http: HttpClient, private property: PropertyStoreService, @Inject(API_BASE_HREF) protected api: string) {
  }

  public update(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>(this.api + 'publication/', publication);
  }

  public getPublicationStatus(): Promise<PublicationStatus[]> {
    const PUB_STATUS = 'PUBLICATIONSTATUS';
    if (this.property.has(PUB_STATUS)) {
      const list = this.property.get(PUB_STATUS);
      return Promise.resolve(list);
    }
    return this.http.get<HalResource>(this.api + 'publicationstatus/search/all').toPromise()
    .then(result => {
      this.property.set(PUB_STATUS, result._embedded.publicationStatuses);
      return result._embedded.publicationStatuses as unknown as PublicationStatus[] ;
    });
  }

}
