import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  model: any = {};
  constructor(private authService: AuthService) {
  }

  ngOnInit() {
  }

  register() {
    this.authService.resetPassword(this.model).subscribe((result:any)=> {
      throw result;
    });
  }
}
