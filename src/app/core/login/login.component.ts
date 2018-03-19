import { AfterContentChecked,  Component, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var Materialize: any;

export class LoginForm {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterContentChecked {
  // AfterViewChecked, AfterContentChecked {
  model: any = {};
  loading = false;
  returnUrl: string;
  once = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: UserService) { }


  ngAfterContentChecked(): void {
    console.info('AfterContentChecked');
    if (this.once < 10) {
      this.once ++;
      Materialize.updateTextFields();
    }
  }


  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.model.email = this.authenticationService.getEmail();
    if ( this.model.email === 'review@example.org') {
      this.model.password = 'password';
    }
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    Materialize.updateTextFields();
  }

  login() {
    this.loading = true;
    this.authenticationService.signIn(this.model.email, this.model.password)
      .subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/home']);
        },
        error => {
          this.loading = false;
          throw error;
        });
  }
}
