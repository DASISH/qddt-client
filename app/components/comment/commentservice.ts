import {Injectable} from 'angular2/angular2';
import {Http, Headers} from 'angular2/http';
import {ListWrapper} from "../../../node_modules/angular2/src/facade/collection";


export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  createdBy: any;
}

@Injectable()
export class CommentService {
  private comment: Comment;
  private comments: Array<Comment> = [];

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
      .map(res => res.json())
      .subscribe(
        data  =>  this.comment = data,
        err   =>  this.logError(err)
      );

    return this.comment;
  }

  getAll(ownerId: string): Array<Comment> {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');

    this.http.post('http://localhost:8080/comment/page/'+ownerId,
      JSON.stringify(this.comment),
      {
        headers: headers
      })
      .map(res => res.json())
      .subscribe(
        data  =>  this.comments.push(data),
        err   =>  this.logError(err)
      );
  }

  logError(err: string) {
    console.log('Error: ', err);
  }

}



