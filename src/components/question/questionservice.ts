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
  private question;

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.page = 0;
    this.totalPages = 0;
  }

  static logError(err: string) {
    console.log(err);
  }

  onPrev() {
    if (this.page !== 0) {
      --this.page;
    }

    this.getQuestions();
  }

  onNext() {
    if (this.page <= this.totalPages) {
      ++this.page;
    }

    this.getQuestions();
  }

  getQuestions() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);


    return this.http.get(this.api+'question/page', //?page=' +this.page,
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:any)  =>  {
          this.page = data.page;

          data.content.forEach(s => {
            this.questions.push(s);
          });
        },
        (err: any) => QuestionService.logError(err.toLocaleString())
      //.subscribe(q =>this.questions = q.content,
      //  (err: any) => QuestionService.logError()
      );
  }

  getModel(): Array<Question> {
    this.getQuestions();
    return this.questions;
  }

  save(entity: Question): Question {
    this.question = entity;

    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');


    this.http.post(this.api+'question/create',
      JSON.stringify(this.question),
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Question)  => {
          this.question = data;
          this.question.push(this.question);
        },
        err   =>  QuestionService.logError('Unable to save Question.')
      );

    return this.question;
  }


}
