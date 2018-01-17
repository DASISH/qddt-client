import { Component, OnInit } from '@angular/core';
import { Router,
         NavigationExtras } from '@angular/router';
import { AuthService }      from './../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  message: string;

  constructor(private authService: AuthService, public router: Router) {
  	this.message = '';
  }

  ngOnInit() {
  }

  register() {
    this.message = 'Registering your account ...';
    this.authService.registerUser(this.model).subscribe((result:any)=> {
      throw result;
    });
  }

}
