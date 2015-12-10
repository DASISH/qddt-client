import {Injectable, Observable, Inject} from 'angular2/angular2';
import {Http, Headers, Response} from 'angular2/http';

import {UserService} from '../../common/userservice';

export class Agency {
  id: any;
  name: string;
}

@Injectable()
export class AgencyService {

  private http: Http;
  private userService: UserService;

  constructor(http: Http, @Inject(UserService)userService: UserService) {
    this.http = http;
    this.userService = userService;
  }

  get() : any {
    return this.userService.get().agency;
  }
}
