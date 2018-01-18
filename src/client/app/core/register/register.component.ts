import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {  UserService } from '../user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  message: string;

  constructor(private authService: UserService, public router: Router) {
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
