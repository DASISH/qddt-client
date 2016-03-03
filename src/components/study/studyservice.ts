import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

export class Study {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class StudyService {

  private headers: Headers;
  private surveyProgramId:string;

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.headers.append('Content-Type', 'application/json');
  }

  static logError(err: string) {
    console.log('StudyService: ', err);
  }

  save(study: Study, surveyProgramId: String): Study {
    this.http.post(this.api+'study/'+surveyProgramId+'/create',
      JSON.stringify(study),
      {
        headers: this.headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Study) => study = data,
        err          => StudyService.logError('Unable to save SurveyProgram.')
      );

    return study;
  }

  update(study: Study): any {
    return this.http.post(this.api+'study/',
      JSON.stringify(study),
      {
        headers: this.headers
      })
      .map((res: Response) => {
        return res.json();
      });
  }

  getAll(surveyProgramId: String) : any {
    return this.http.get(this.api+'surveyprogram/'+surveyProgramId,
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }


  getModel(): Array<Study> {
    return this.getAll(this.surveyProgramId);
  }



}
