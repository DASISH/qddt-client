import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {API_BASE_HREF} from '../../api';
import {BaseService} from '../../common/base.service';

export class Topic {
  id: string;
  name: string;
  abstract_description:string;
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

}
