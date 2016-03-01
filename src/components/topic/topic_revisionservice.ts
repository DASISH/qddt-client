import {Injectable} from '../../../node_modules/angular2/core.d';
import {Http, Headers, Response} from '../../../node_modules/angular2/http.d';

@Injectable()
export class TopicRevisionService {

  constructor(private http: Http) {

  }

  static logError(err: string) {
    console.log(err);
  }

  getAllRevisions(id: string) {
    var headers = new Headers();
    headers.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);

    return this.http.get('http://nsd349.nsd.lan:8080/audit/topic/'+id+'/list',
      {
        headers: headers
      })
      .map((res:Response) => res.json());
  }

}
