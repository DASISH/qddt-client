import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_HREF } from '../../api';
import { Publication, PublicationStatus } from './publication.classes';


@Injectable()
export class PublicationService {

  public publication_statuses$:  Promise<PublicationStatus[]>;

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
    this.publication_statuses$ = this.getPublicationStatus();
  }

  public update(publication: Publication): Observable<Publication> {
    return this.http.post<Publication>(this.api + 'publication/', publication);
  }


  private async getPublicationStatus(): Promise<PublicationStatus[]> {
    return await this.http.get<PublicationStatus[]>(this.api + 'publicationstatus/list').toPromise();
  }

}
