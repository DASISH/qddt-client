import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import {Observable} from "../../../node_modules/rxjs/Observable";

export class Study {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class StudyService {

  constructor(private http: Http) {

  }

  static logError(err: string) {
    console.log('StudyService: ', err);
  }


  save(study: Study, surveyProgramId: String): Study {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');

    this.http.post('http://localhost:8080/study/'+surveyProgramId+'/create',
      JSON.stringify(study),
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Study) => study = data,
        err          => StudyService.logError('Unable to save SurveyProgram.')
      );

    return study;
  }

  getAll(surveyProgramId: String) : any {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://localhost:8080/surveyprogram/list/user',
      {
        headers: headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

}
