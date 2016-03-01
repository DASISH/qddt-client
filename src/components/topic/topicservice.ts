import {Injectable} from '../../../node_modules/angular2/core.d';
import {Http, Headers, Response} from '../../../node_modules/angular2/http.d';

export class Topic {
  id: string;
  name: string;
}

@Injectable()
export class TopicService {

  topic: Topic = new Topic();
  topics: Array<Topic> = [];

  constructor(private http: Http) {
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


    this.http.post('http://nsd349.nsd.lan:8080/topic/create',
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

    return this.http.get('http://nsd349.nsd.lan:8080/topic/list/user',
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
