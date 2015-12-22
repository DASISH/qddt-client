import {Injectable, Inject} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, Response} from 'angular2/http';

@Injectable()
export class SurveyProgramRevisionService {

  constructor(private http: Http) {

  }

  static logError(err: string) {
    console.log(err);
  }

  getAllRevisions(id: string) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://localhost:8080/audit/surveyprogram/'+id+'/list',
      {
        headers: headers
      })
      .map((res:Response) => res.json());
  }

}
