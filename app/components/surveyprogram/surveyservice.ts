import {Injectable, Inject} from 'angular2/core';
import {HTTP_PROVIDERS, Http, Headers, Response} from 'angular2/http';

export class SurveyProgram {
  id: string;
  name: string;
}

@Injectable()
export class SurveyService {

  surveyProgram: SurveyProgram = new SurveyProgram();
  surveyPrograms: Array<SurveyProgram> = [];

  constructor(private http: Http) {
    this.getAll();
  }


  static logError(err: string) {
    console.log('SurveyService: ', err);
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
      .map((res:Response) => res.json())
      .subscribe(
        (data:SurveyProgram)  => {
          this.surveyProgram = data;
          this.surveyPrograms.push(this.surveyProgram);
          console.log('DEMO', this.surveyProgram);
        },
        err   =>  SurveyService.logError('Unable to save SurveyProgram.')
      );

    return this.surveyProgram;
  }

  getAll() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://localhost:8080/surveyprogram/list/user',
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Array<SurveyProgram>)  => {
          data.forEach(s => {
            this.surveyPrograms.push(s);
          });
        },
        (err: any) => SurveyService.logError('Unable to get all SurveyProgram')
      );
  }

  getModel(): Array<SurveyProgram> {
    return this.surveyPrograms;
  }
}
