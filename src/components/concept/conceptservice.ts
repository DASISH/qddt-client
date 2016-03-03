import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

export class Concept {
  id: string;
  name: string;
}

@Injectable()
export class ConceptService {

  concept: Concept = new Concept();
  concepts: Array<Concept> = [];

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.getAll();
  }


  static logError(err: string) {
    console.log('ConceptService: ', err);
  }

  save(concept: Concept): Concept {
    this.concept = concept;

    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');


    this.http.post(this.api+'concept/create',
      JSON.stringify(this.concept),
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Concept)  => {
          this.concept = data;
          this.concepts.push(this.concept);
        },
        err   =>  ConceptService.logError('Unable to save Concept.')
      );

    return this.concept;
  }

  getAll() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get(this.api+'concept/list/user',
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Array<Concept>)  => {
          data.forEach(s => {
            this.concepts.push(s);
          });
        },
        (err: any) => ConceptService.logError('Unable to get all Concept')
      );
  }

  getModel(): Array<Concept> {
    return this.concepts;
  }
}
