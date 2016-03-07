import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

export class Topic {
  id: string;
  name: string;
  description: string;
}

@Injectable()
export class TopicService {

  topic: Topic = new Topic();
  topics: Array<Topic> = [];
  private headers;

  constructor(private http: Http,   @Inject(API_BASE_HREF) private api: string) {
    this.headers = new Headers();
    this.headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    this.headers.append('Content-Type', 'application/json');

    this.getAll();
  }


  static logError(err: string) {
    console.log('TopicService: ', err);
  }

  save(topic: Topic,studyId:String): Topic {
    this.topic = topic;

    this.http.post(this.api+'topic/'+studyId+'/create',
      JSON.stringify(this.topic),
      {
        headers: this.headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Topic)  => {
          this.topic = data;
          this.topics.push(this.topic);
        },
        err   =>  TopicService.logError('Unable to save Topic.')
      );

    return this.topic;
  }

  getAll(studyId: String) : any {
    return this.http.get(this.api+'topic/'+studyId,
      {
        headers: this.headers
      })
      .map((res:Response) => {
        return res.json();
      });
  }

  getModel(): Array<Topic> {
    return this.topics;
  }
}
