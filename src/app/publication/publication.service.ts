import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../api';
import { Publication, PUBLICATION_TYPES, PublicationStatus} from './publication.classes';


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
