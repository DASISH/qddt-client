import { Injectable, Inject } from '@angular/core';
// import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../base.service';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';

export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  modifiedBy: any;
  isHidden: boolean=false;
  public:boolean=true;
}

@Injectable()
export class CommentService  {

  constructor(protected http:HttpClient,protected auth: AuthService, @Inject(API_BASE_HREF) protected api:string) {
    // super(http, auth ,api);
  }

  createComment(comment: Comment): any {
    return this.http.post( this.api +'comment/create/' + comment.ownerId, comment);
  }

  updateComment(comment: Comment): any {
    return this.http.post(this.api +'comment',comment);
  }

  deleteComment(id:string):  any {
    return this.http.delete(this.api +'comment/delete/'+ id);
  }

  getAll(ownerId: string): Promise<any> {
    return this.http.get(this.api +'comment/page/by-owner/' + ownerId + '?page=0&size=20&sort=asc')
      .toPromise();
  }

}
