import { Injectable, Inject } from '@angular/core';
import { Http, RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { API_BASE_HREF } from '../../api';
import { BaseService } from '../../common/base.service';
import { ConceptQuestionItem } from '../concept/concept.service';

export class Topic {
  id: string;
  name: string;
  abstractDescription:string;
  authors: any[];
  otherMaterials: any[];
  topicQuestionItems: ConceptQuestionItem[];
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

  deleteTopic(topicId: string) : any {
    return this.delete('topicgroup/delete/'+ topicId);
  }

  getAll(studyId: string): any {
    return this.get('topicgroup/list/by-study/'+studyId);
  }

  getTopic(id: string): any {
    return this.get('topicgroup/' + id);
  }

  attachAuthor(topicId: string, authorId: string):any {
    return this.post({},'author/combine?authorId='+ authorId + '&topicId=' +topicId);
  }

  deattachAuthor(topicId: string, authorId: string):any {
    return this.delete('author/decombine?authorId='+ authorId + '&topicId=' +topicId);
  }

  attachQuestion(topicId: string, questionId: string, revision: string):any {
    if (revision===null)
      revision ='0';
    return this.post({},'topicgroup/combine?questionitemid='+ questionId+ '&questionitemrevision=' + revision + '&topicid='+ topicId);
  }

  deattachQuestion(topicId: string, questionId: string):any {
    return this.delete('topicgroup/decombine?questionitemid='+ questionId+ '&topicid='+ topicId);
  }

  getFile(id: string) {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'othermaterial/files/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }

  uploadFile(id: string, files: any): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers });
    const formData = new FormData();
    if(files !== null) {
      formData.append('file', files[0]);
    }
    return this.http.post(this.api + 'othermaterial/upload/' + id, formData, options)
      .map((res:any) => {
        try {
          return res.json();
        } catch (e) {
          return [];
        }
      })
      .catch(this.handleError);
  }

  deleteFile(id: string) {
    return this.delete('othermaterial/delete/' + id);
  }

  getPdf(id: string): any {
    let headers = new Headers();
    let jwt = localStorage.getItem('jwt');
    if(jwt !== null) {
      headers.append('Authorization', 'Bearer  ' + JSON.parse(jwt).access_token);
    }
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.http.get(this.api + 'topicgroup/pdf/' + id, options)
      .map(res => res.blob())
      .catch(this.handleError);
  }}
