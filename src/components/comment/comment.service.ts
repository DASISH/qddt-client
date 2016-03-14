import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  modifiedBy: any;
}

@Injectable()
export class CommentService {

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: String) {
    this.http = http;
  }

  save(comment: Comment): any {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.post(this.api+'comment/create/' + comment.ownerId,
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

    return this.http.get(this.api+'comment/by-owner/' + ownerId + '?page=0&size=20&sort=asc',
      {
        headers: headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

}
