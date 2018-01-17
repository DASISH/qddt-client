import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  model: any = {};

  constructor(public authService: AuthService) {
  }

  ngOnInit() {
  }

  forgot() {
    this.authService.forgotPassword(this.model).subscribe((result:any)=> {
      throw result;
    });
  }
}
