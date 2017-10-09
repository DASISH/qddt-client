import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../base.service';

export class Comment {
  id: string;
  ownerId: string;
  comment: string;
  modifiedBy: any;
  isHidden: boolean=false;
  public:boolean=true;
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

  deleteComment(id:string):  any {
    return this.delete('comment/delete/'+ id);
  }

  getAll(ownerId: string): any {
    return this.get('comment/page/by-owner/' + ownerId + '?page=0&size=20&sort=asc');
  }

}
