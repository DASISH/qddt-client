import { Component, ViewEncapsulation, Inject, AfterContentChecked } from '@angular/core';

import { UserService } from '../../common/user.service';

@Component({
  selector: 'app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ UserService ]
})

export class AppCmp implements AfterContentChecked {

  public user: string;
  private userService: UserService;

  constructor(@Inject(UserService)userService: UserService) {
    this.userService = userService;
    this.user = this.userService.get();
  }

  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  logoutEvent() {
    this.userService.remove();
  }
}
