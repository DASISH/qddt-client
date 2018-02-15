import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-register',
  moduleId: module.id,
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  model: any = {};
  agencies$ = {};

  constructor(private authService: UserService, public router: Router ) {
  }

  ngOnInit() {
    // this.authService.getAgencies().then((result) => {
    //     this.agencies$ = result;
    //   },
    //   (error: any) => {
    //     throw error;
    //   });
  }

  register() {
    this.authService.registerUser(this.model).subscribe((result:any)=> {
      throw result;
    });
  }

}
