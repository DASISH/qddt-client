import { Component, OnInit } from '@angular/core';
import { UserService, IPassword, ResetPassword } from '../user/user.service';

@Component({
  selector: 'qddt-resetpassword',
  moduleId: module.id,
  templateUrl: './resetpassword.component.html'
})



export class ResetpasswordComponent implements OnInit {

  public formId = Math.round( Math.random() * 10000);
  public loading = false;
  model: IPassword = { id: null, oldPassword: null, password: null };

  constructor(private authService: UserService) { }

  ngOnInit() {
    // TODO ?
  }

  register() {
    const pwd = new ResetPassword(this.model);
    this.loading = true;
    this.authService.resetPassword(pwd).subscribe((result: any) => {
      this.loading = false;
      throw result;
    });
  }
}
