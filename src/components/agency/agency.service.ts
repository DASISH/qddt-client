import {Injectable, Inject} from 'angular2/core';

import {UserService} from '../../common/user.service';
import {Headers,Http,Response} from 'angular2/http';
import {API_BASE_HREF} from '../../api';


export class Agency {
  id: any;
  name: string;
}

@Injectable()
export class AgencyService {

  constructor(private http: Http,
              @Inject(UserService) private userService: UserService,
              @Inject(API_BASE_HREF) private api: string) {
  }


  get() : any {
    return this.userService.get().agency;
  }


  getById(agencyId:String): any {
    var header = new Headers();
    header.append('Authorization', 'Bearer  '+ JSON.parse(localStorage.getItem('jwt')).access_token);
    header.append('Content-Type', 'application/json');

    return this.http.get(this.api+'agency/'+ agencyId,
      {
        headers: header
      })
      .map((res: Response) => {
        return res.json();
      }),
      (err: any) => console.log('Agency: ', err);
  }





}
