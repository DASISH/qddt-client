import {Injectable, Inject} from 'angular2/core';
import {Http, Headers, Response} from 'angular2/http';

import {API_BASE_HREF} from '../../api';

export class Topic {
  id: string;
  name: string;
}

@Injectable()
export class TopicService {

  topic: Topic = new Topic();
  topics: Array<Topic> = [];

  constructor(private http: Http, @Inject(API_BASE_HREF) private api: string) {
    this.getAll();
  }


  static logError(err: string) {
    console.log('TopicService: ', err);
  }

  save(topic: Topic): Topic {
    this.topic = topic;

    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    headers.append('Content-Type', 'application/json');


    this.http.post(this.api+'topic/create',
      JSON.stringify(this.topic),
      {
        headers: headers
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

  getAll() {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get(this.api+'topic/list/user',
      {
        headers: headers
      })
      .map((res:Response) => res.json())
      .subscribe(
        (data:Array<Topic>)  => {
          data.forEach(s => {
            this.topics.push(s);
          });
        },
        (err: any) => TopicService.logError('Unable to get all Topic')
      );
  }

  getModel(): Array<Topic> {
    return this.topics;
  }
}
