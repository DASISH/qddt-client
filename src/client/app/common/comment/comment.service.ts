import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  modifiedBy: any;
}

@Injectable()
export class CommentService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http, api);
  }

  createComment(comment: Comment): any {
    return this.post(comment, 'comment/create/' + comment.ownerId);
  }

  updateComment(comment: Comment): any {
    return this.post(comment, 'comment');
  }

  getAll(ownerId: string): any {
    return this.get('comment/page/by-owner/' + ownerId + '?page=0&size=20&sort=asc');
  }

}
