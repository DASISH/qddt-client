import { Component, OnInit } from '@angular/core';
import { UserService, IPassword } from '../user/user.service';

@Component({
  selector: 'qddt-resetpassword',
  moduleId: module.id,
  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent implements OnInit {

  public formId = Math.round( Math.random() * 10000);
  model: IPassword;

  constructor(private authService: UserService) { }

  ngOnInit() {
    // TODO ?
  }

  register() {
    this.authService.resetPassword(this.model).subscribe((result: any) => {
      throw result;
    });
  }
}
