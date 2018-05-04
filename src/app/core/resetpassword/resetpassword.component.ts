import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';

@Component({
  selector: 'qddt-resetpassword',
  moduleId: module.id,
  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent implements OnInit {
  model: any = {};
  constructor(private authService: UserService) {
  }

  ngOnInit() {
    // TODO ?
  }

  register() {
    this.authService.resetPassword(this.model).subscribe((result: any) => {
      throw result;
    });
  }
}
