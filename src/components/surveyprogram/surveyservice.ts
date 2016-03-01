import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import DateTimeFormat = Intl.DateTimeFormat;

export class SurveyProgram {
  id: string;
  name: string;
  created:DateTimeFormat;
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


    this.http.post('http://nsd349.nsd.lan:8080/surveyprogram/create',
      JSON.stringify(this.surveyProgram),
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:SurveyProgram)  => {
          this.surveyProgram = data;
          this.surveyPrograms.push(this.surveyProgram);
        },
        err   =>  SurveyService.logError('Unable to save SurveyProgram.')
      );

    return this.surveyProgram;
  }

  //delete(surveyProgram: SurveyProgram){
  //  var headers = new Headers();
  //  headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
  //  headers.append('Content-Type', 'application/json');
  //
  //
  //  this.http.post('http://nsd349.nsd.lan:8080/surveyprogram/delete/'+ surveyProgram.id,
  //    null,{
  //      headers: headers
  //    }),
  //    err =>  SurveyService.logError('Unable to delete SurveyProgram.')
  //    );
  //
  //}

  getAll() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://nsd349.nsd.lan:8080/surveyprogram/list/user',
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Array<SurveyProgram>)  =>  {
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
