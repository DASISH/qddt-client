import {Injectable, Inject} from 'angular2/angular2';
import {Http, Headers} from 'angular2/http';

export class SurveyProgram {
  public name: string;
}

@Injectable()
export class SurveyService {

  surveyProgram: SurveyProgram;
  surveyPrograms: Array<SurveyProgram> = [];

  http: Http;

  constructor(http: Http) {
    this.http = http;
    this.getAll();
  }

  save(surveyProgram: SurveyProgram): SurveyProgram {
    this.surveyProgram = surveyProgram;

    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');

    this.http.post('http://localhost:8080/surveyprogram/create',
      JSON.stringify(this.surveyProgram),
      {
        headers: headers
      })
      .map(res => res.json())
      .subscribe(
        data  =>  this.surveyPrograms.push(data),
        data  =>  this.surveyProgram = data,
        err   =>  this.logError(err)
      );

    return this.surveyProgram;
  }


  get(): SurveyProgram {
    return new SurveyProgram();
  }

  getAll(): Array<SurveyProgram> {
    console.log('getting all');
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://localhost:8080/surveyprogram/list/user',
      {
        headers: headers
      })
      .map(res => res.json()).subscribe(
        data  => {
          data.forEach(s => {
            console.log(s);
            this.surveyPrograms.push(s);
          })
        }
      );
  }

  getModel(): Array<SurveyProgram> {
    return this.surveyPrograms;
  }

  logError(err: string) {
    console.log('Error: ', err);
  }
}