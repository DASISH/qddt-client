import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { ConceptQuestionItem } from '../concept/concept.service';

export class Topic {
  id: string;
  name: string;
  abstractDescription:string;
  archived:boolean;
  authors: any[];
  otherMaterials: any[];
  topicQuestionItems: ConceptQuestionItem[];
}

@Injectable()
export class TopicService extends BaseService {

  constructor(protected http: Http, @Inject(API_BASE_HREF) protected api: string) {
    super(http, api);
  }

  save(topic: Topic, studyId: string): any {
    return this.post(topic, 'topicgroup/create/' + studyId);
  }

  edit(topic: Topic): any {
    return this.post(topic, 'topicgroup/');
  }

  deleteTopic(topicId: string): any {
    return this.delete('topicgroup/delete/' + topicId);
  }

  getAll(studyId: string): any {
    return this.get('topicgroup/list/by-study/' + studyId);
  }

  getTopic(id: string): any {
    return this.get('topicgroup/' + id);
  }

  attachAuthor(topicId: string, authorId: string): any {
    return this.post({}, 'author/combine?authorId=' + authorId + '&topicId=' + topicId);
  }

  deattachAuthor(topicId: string, authorId: string): any {
    return this.delete('author/decombine?authorId=' + authorId + '&topicId=' + topicId);
  }

  attachQuestion(topicId: string, questionId: string, revision: string): any {
    if (revision === null)
      revision = '0';
    return this.post({}, 'topicgroup/combine?questionitemid=' + questionId + '&questionitemrevision=' + revision + '&topicid=' + topicId);
  }

  deattachQuestion(topicId: string, questionId: string): any {
    return this.delete('topicgroup/decombine?questionitemid=' + questionId + '&topicid=' + topicId);
  }

  getFile(id: string):any {
    return this.getBlob('othermaterial/files/'+id);
  }

  uploadFile(id: string, files: any): any {
    return this.uploadBlob(id,files);
  }

  deleteFile(id: string) {
    return this.delete('othermaterial/delete/' + id);
  }

  getPdf(id: string) {
    return this.getBlob('topicgroup/pdf/'+ id);
  }

}

