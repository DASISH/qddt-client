import {Injectable, Inject} from 'angular2/core';

import {UserService} from '../../common/user.service';


export class Agency {
  id: any;
  name: string;
}

@Injectable()
export class AgencyService {

  private userService: UserService;

  constructor(@Inject(UserService)userService: UserService) {
    this.userService = userService;
  }

  get() : any {
    return this.userService.get().agency;
  }
}
