import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

@Injectable()
export class StudyRevisionService {

  constructor(private http: Http) {

  }

  static logError(err: string) {
    console.log(err);
  }

  getAllRevisions(id: string) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://nsd349.nsd.lan:8080/audit/study/'+id+'/list',
      {
        headers: headers
      })
      .map((res:Response) => res.json());
  }

}
