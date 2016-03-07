import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

export class Topic {
  id: string;
  name: string;
}

@Injectable()
export class TopicService {

  topics: Array<Topic> = [];
  private headers: Headers;

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.headers.append('Content-Type', 'application/json');
  }


  static logError(err: string) {
    console.log('TopicService: ', err);
  }

  save(topic: Topic): any {
    return this.http.post(this.api+'topicgroup/create',
      JSON.stringify(topic),
      {
        headers: this.headers
      })
      .map((res: Response) => {
        return res.json();
      });
  }

  getAll(): any {
    return this.http.get(this.api+'topicgroup/list/user',
      {
        headers: this.headers
      })
      .map((res: Response) => {
        return res.json();
      });
  }

}
