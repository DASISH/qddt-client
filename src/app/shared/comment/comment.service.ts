import { Injectable, Inject } from '@angular/core';
import { API_BASE_HREF } from '../../api';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  modifiedBy: any;
  isHidden = false;
  public = true;
}

@Injectable()
export class CommentService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  createComment(comment: Comment): Observable<any> {
    return this.http.post( this.api + 'comment/create/' + comment.ownerId, comment);
  }

  updateComment(comment: Comment): Observable<any> {
    return this.http.post(this.api + 'comment', comment);
  }

  deleteComment(id: string):  any {
    return this.http.delete(this.api + 'comment/delete/' + id);
  }

  getAll(ownerId: string): Promise<any> {
    return this.http.get(this.api + 'comment/page/by-owner/' + ownerId + '?page=0&size=20&sort=asc')
      .toPromise();
  }

}
