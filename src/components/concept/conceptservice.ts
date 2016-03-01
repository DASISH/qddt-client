import {Injectable} from '../../../node_modules/angular2/core.d';
import {Http, Headers, Response} from '../../../node_modules/angular2/http.d';

export class Concept {
  id: string;
  name: string;
}

@Injectable()
export class ConceptService {

  concept: Concept = new Concept();
  concepts: Array<Concept> = [];

  constructor(private http: Http) {
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


    this.http.post('http://nsd349.nsd.lan:8080/concept/create',
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

    return this.http.get('http://nsd349.nsd.lan:8080/concept/list/user',
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
