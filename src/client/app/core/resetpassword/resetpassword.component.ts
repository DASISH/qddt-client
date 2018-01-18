import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  model: any = {};
  constructor(private authService: UserService) {
  }

  ngOnInit() {
  }

  register() {
    this.authService.resetPassword(this.model).subscribe((result:any)=> {
      throw result;
    });
  }
}
