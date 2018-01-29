import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_HREF } from '../../api';
import { ConceptQuestionItem } from '../concept/concept.service';
import { Observable } from 'rxjs/Observable';

export class Topic {
  id: string;
  name: string;
  abstractDescription: string;
  archived: boolean;
  authors: any[];
  otherMaterials: any[];
  topicQuestionItems: ConceptQuestionItem[];
}

@Injectable()
export class TopicService  {

  constructor(protected http: HttpClient, @Inject(API_BASE_HREF) protected api: string) {
}

  getAll(studyId: string): Promise<any> {
    return this.http.get(this.api +'topicgroup/list/by-study/' + studyId).toPromise();
  }

  getTopic(id: string): Promise<any> {
    return this.http.get(this.api +'topicgroup/' + id).toPromise();
  }

  getFile(id: string): Promise<any> {
    return this.http.get(this.api +'othermaterial/files/' + id,{ responseType:'blob'})
      .toPromise();
  }

  getPdf(id: string):Promise<Blob> {
    return this.http.get(this.api +'topicgroup/pdf/' + id, { responseType:'blob'})
      .toPromise();
  }

  save(topic: Topic, studyId: string): Observable<any> {
    return this.http.post(this.api +'topicgroup/create/' + studyId, topic);
  }

  edit(topic: Topic): Observable<any> {
    return this.http.post(this.api +'topicgroup/',topic);
  }

  deleteTopic(topicId: string): Observable<any> {
    return this.http.delete(this.api +'topicgroup/delete/' + topicId);
  }

  attachAuthor(topicId: string, authorId: string): Observable<any> {
    return this.http.post(this.api +'author/combine?authorId=' + authorId + '&topicId=' + topicId,{});
  }

  deattachAuthor(topicId: string, authorId: string): Observable<any> {
    return this.http.delete(this.api +'author/decombine?authorId=' + authorId + '&topicId=' + topicId);
  }

  attachQuestion(topicId: string, questionId: string, revision: string): Observable<any> {
    if (revision === null)
      revision = '0';
    return this.http.post(this.api +'topicgroup/combine?questionitemid=' + questionId +
      '&questionitemrevision=' + revision + '&topicid=' + topicId,{});
  }

  deattachQuestion(topicId: string, questionId: string): Observable<any> {
    return this.http.post(this.api +'topicgroup/decombine?questionitemid=' + questionId + '&topicid=' + topicId,{});
  }


  deleteFile(id: string): Observable<any> {
    return this.http.delete(this.api+'othermaterial/delete/' + id);
  }

  uploadFile(id: string, files: any): Observable<any> {
    const formData = new FormData();
    if (files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id, formData)
      .map((res: any) => {
        try {
          return res;
        } catch (e) {
          return [];
        }
      });
  }

}

