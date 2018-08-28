import { AfterContentChecked,  Component, OnInit,  AfterViewChecked, AfterContentInit, ViewChild, AfterViewInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var Materialize: any;

export class LoginForm {
  username?: string;
  email: string;
  password = '';
  // isValid() { return this.username.length > 7 && this.password.length > 6; }
}

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent implements  AfterContentChecked, AfterContentInit {

  public loginForm = new LoginForm();
  loading = false;
  once = 0;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
  }

  ngAfterContentInit(): void {
    this.loginForm.email = this.authenticationService.getEmail();
  }

  ngAfterContentChecked(): void {
    if (this.once < 10) {
      this.once ++;
      try {
        Materialize.updateTextFields();
      } catch  {
        // console.debug('Materialize not initialized...');
      }
    }
  }

  login() {
    this.loading = true;
    this.authenticationService.signIn(this.loginForm.email, this.loginForm.password).then(
        () => { console.log('login successful');  this.loading = false; },
        (error) => { this.loading = false; throw error; }
        );
  }
}
