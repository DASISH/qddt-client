import {Injectable} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  createdBy: any;
}

@Injectable()
export class CommentService {

  constructor(private http: Http) {
    this.http = http;
  }

  save(comment: Comment): any {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.post('http://nsd349.nsd.lan:8080/comment/create/' + comment.ownerId,
      JSON.stringify(comment),
      {
        headers: headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

  getAll(ownerId: string): any {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  ' + JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.get('http://nsd349.nsd.lan:8080/comment/by-owner/' + ownerId + '?page=0&size=20&sort=asc',
      {
        headers: headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

}
