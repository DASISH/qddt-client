import { Injectable, Inject } from '@angular/core';
import { API_BASE_HREF } from '../../api';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConceptrefService {

  constructor(protected http: HttpClient,  @Inject(API_BASE_HREF) protected api: string) { }

  getConceptsById(id: string): Promise<any> {
    return this.http.get(this.api + 'concept/' + id).toPromise();
  }

  getTopicById(id: string): Promise<any> {
    return this.http.get(this.api + 'topicgroup/' + id).toPromise();
  }

  getStudyById(id: string): Promise<any> {
    return this.http.get(this.api + 'study/' + id).toPromise();
  }
}
