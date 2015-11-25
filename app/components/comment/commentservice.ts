import {Injectable, Observable} from 'angular2/angular2';
import {Http, Headers, Response} from 'angular2/http';

export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  createdBy: any;
}

@Injectable()
export class CommentService {
  private comment: Comment;
  public comments: Array<Comment> = [];

  constructor(private http: Http) {
    this.http = http;
  }

  save(comment: Comment): Comment {
    this.comment = comment;

    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');

    this.http.post('http://localhost:8080/comment/create/'+comment.ownerId,
      JSON.stringify(this.comment),
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        data  =>  this.comment = data,
        err   =>  this.logError(err)
      );

    return this.comment;
  }

  getAll(ownerId: string): any {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  ' + JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');

    this.http.get('http://localhost:8080/comment/by-owner/' + ownerId + '?page=0&size=20',
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        emitter   =>   this.comments.push(emitter),
        onError   =>   console.log('onError', onError),
        ()        =>   console.log('Complete ['+ownerId+']', this.comments)
      );

    return this.comments;

  //static subscribe<T>(emitter: any, onNext: (value: T) => void, onError?: (exception: any) => void, onComplete?: () => void): Object;
  }

  getModel(): any {
    return this.comments;
  }

  logError(err: string) {
    console.log('Error: ', err);
  }

}



