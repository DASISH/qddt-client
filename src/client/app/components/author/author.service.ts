import { Injectable, Inject } from '@angular/core';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { Http } from '@angular/http';

export class Author {
  id:string;
  name:string;
  picture:string;
}

@Injectable()
export class AuthorService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(author: Author) : any {
    return this.post(author, 'author/create/');
  }

  updateAuthor(author: Author) : any {
    return this.post(author, 'author');
  }

  getAll() : any {
    return this.get('author/page/');
  }

  attachAuthor(authorId: string, surveyId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&surveyId=' +surveyId);
  }

  deattachAuthor(authorId: string, surveyId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&surveyId=' +surveyId);
  }
}
