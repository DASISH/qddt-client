import { Component, EventEmitter, Output,  AfterContentChecked } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'qddt-user-login',
  moduleId: module.id,
  providers: [AuthService],
  templateUrl: 'user.component.html',
})
export class UserLoginComponent implements AfterContentChecked {

  @Output('logoutEvent') logoutEvent: EventEmitter<string> = new EventEmitter<string>();
  user: any;

  constructor(private loginService: AuthService) {
    this.user = this.loginService.get();
  }

  ngAfterContentChecked() {
    this.user = this.loginService.get();
  }

  loginEvent() {
    this.user = this.loginService.get();
  }

  logout() {
    this.user = null;
    this.logoutEvent.emit('');
  }
}
