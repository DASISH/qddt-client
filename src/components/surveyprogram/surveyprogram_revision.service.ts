import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

@Injectable()
export class SurveyProgramRevisionService {

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {

  }

  static logError(err: string) {
    console.log(err);
  }

  getAllRevisions(id: string) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get(this.api+'audit/surveyprogram/'+id+'/list',
      {
        headers: headers
      })
      .map((res:Response) => res.json());
  }

}
