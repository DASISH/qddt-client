import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';

import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';

export class Topic {
  id: string;
  name: string;
  abstract_description:string;
  authors: any[];
}

@Injectable()
export class TopicService extends BaseService {

  constructor(protected http:Http, @Inject(API_BASE_HREF) protected api:string) {
    super(http ,api);
  }

  save(topic: Topic, studyId: string): any {
    return this.post(topic,'topicgroup/create/'+studyId);
  }

  edit(topic: Topic): any {
    return this.post(topic,'topicgroup/');
  }

  getAll(studyId: string): any {
    return this.get('topicgroup/list/by-study/'+studyId);
  }

  getTopic(id: string): any {
    return this.get('topicgroup/' + id);
  }

  attachAuthor(topicId: string, authorId: string):any {
    return this.get('author/combine?authorId='+ authorId + '&topicId=' +topicId);
  }

  deattachAuthor(topicId: string, authorId: string):any {
    return this.get('author/decombine?authorId='+ authorId + '&topicId=' +topicId);
  }
}
