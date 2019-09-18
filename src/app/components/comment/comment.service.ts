import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {API_BASE_HREF, IComment, IPageResult, Page} from '../../lib';


@Injectable()
export class CommentService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) { }

  // create(comment: IComment): Observable<IComment> {
  //   return this.http.post<IComment>( this.api + 'comment/create/' + comment.ownerId, comment);
  // }

  update(comment: IComment): Observable<IComment> {
    return this.http.post<IComment>(this.api + 'comment', comment);
  }

  delete(id: string):  any {
    return this.http.delete(this.api + 'comment/delete/' + id);
  }

  getAll(ownerId: string): Promise<IPageResult<IComment>> {
    return this.http.get<IPageResult<IComment>>(this.api + 'comment/page/by-owner/' + ownerId + '?' + new Page( { size: 20 }))
      .toPromise();
  }

}
