import {Component, NgFor, CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/angular2';
import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http';
import {Router} from 'angular2/router';


export class SurveyProgram {

  public name: string;

}

@Component({
  selector: 'surveyprogram-create',
  templateUrl: './components/surveyprogram/create/create.html',
  directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, NgFor],
  viewProviders: [HTTP_PROVIDERS]
})
export class SurveyProgramCreateComponent {

  model: SurveyProgram;
  surveyPrograms: string;

  private http: Http;
  private router: Router;

  constructor(http: Http, router: Router) {
    this.http = http;
    this.router = router;

    this.model = new SurveyProgram();
    this.getSurveyPrograms();
  }

  save() {
    console.log('saved!', this.model);
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    //
    this.http.post('http://localhost:8080/surveyprogram/create',
      JSON.stringify(this.model),
      {
        headers: headers
      })
      .map(res => res.json())
      .subscribe(
      err   => this.logError(err)
    );
  }


  getSurveyPrograms(): any[] {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    return this.http.get('http://localhost:8080/surveyprogram/list/user',
      {
        headers: headers
      })
      .map(res => res.json()).subscribe(
      data => this.surveyPrograms = data
    );
  }

  logError(err: string) {
    console.log('Error: ', err);
  }

  get diagnostic() { return JSON.stringify(this.model); }
}
