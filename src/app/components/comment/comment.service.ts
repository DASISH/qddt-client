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

  update(entity: IComment): Observable<IComment> {
    var pojo = { id:entity.id, comment: entity.comment, public: entity.public }
    if (entity.id) {
      return this.http.put<IComment>(this.api + 'comment/'+ entity.id ,pojo);
    } else {
      return this.http.post<IComment>(this.api + 'comment', entity);
    }
  }

  delete(id: string):  any {
    return this.http.delete(this.api + 'comment' + id);
  }

  getAll(ownerId: string): Promise<IPageResult> {
    return this.http.get<IPageResult>(this.api + 'comment/search/byOwner?ownerId=' + ownerId )
      .toPromise();
  }

}
