import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';
import DateTimeFormat = Intl.DateTimeFormat;

export class Question {
  id: string;
  name: string;
  created:DateTimeFormat;
}


@Injectable()
export class QuestionService {

  questions: Array<Question> = [];

  constructor(private http: Http) {

  }

  static logError(err: string) {
    console.log(err);
  }

  getAllQuestion() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://nsd349.nsd.lan:8080/question/page',
      {
        headers: headers
      })
      .map((res:Response) => res.json());
  }

  getAll(){
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://nsd349.nsd.lan:8080/question/page',
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Array<Question>)  =>  {
          data.forEach(s => {
            this.questions.push(s);
          });
        },
        (err: any) => QuestionService.logError('Unable to get all Questions')
      );
  }

  getModel(): Array<Question> {
    return this.questions;
  }

}
