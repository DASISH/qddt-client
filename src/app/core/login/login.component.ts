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
  returnUrl: string;
  once = 0;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
  }

  ngAfterContentInit(): void {
    if (!this.authenticationService.isTokenExpired()) {
      this.router.navigate(['/home']);
    }
    this.loginForm.email = this.authenticationService.getEmail();
    if ( this.loginForm.email === 'review@example.org') {
      this.loginForm.password = 'password';
    }
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


  // ngOnInit() {
  //   // reset login status
  //   // get return url from route parameters or default to '/'
  //   // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  //   // Materialize.updateTextFields();
  // }

  login() {
    // e.preventDefault();
    console.log(this.loginForm);
    this.loading = true;
    this.authenticationService.signIn(this.loginForm.email, this.loginForm.password)
      .subscribe(
        (value) => { this.router.navigate(['/home']); },
        (error) => { throw error; },
        () => { this.loading = false; }
      );
  }
}
