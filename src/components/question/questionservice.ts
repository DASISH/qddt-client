import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import DateTimeFormat = Intl.DateTimeFormat;

import {API_BASE_HREF} from '../../api';

export class Question {
  id: string;
  name: string;
  created:DateTimeFormat;
}

@Injectable()
export class QuestionService {

  questions:  Array<Question> = [];

  private page: number;
  private totalPages: number;

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.page = 0;
    this.totalPages = 0;
  }

  static logError(err: string) {
    console.log(err);
  }

  save(question: Question): any {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.post(this.api+'question/create',
      JSON.stringify(question),
      {
        headers: headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

  getAll(): any {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  ' + JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.get(this.api+'question/page',
      {
        headers: headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

}
