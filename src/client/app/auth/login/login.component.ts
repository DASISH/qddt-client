import { Component, OnInit } from '@angular/core';
import 'rxjs/Rx';
import { AuthService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';

export class LoginForm {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  templateUrl: './login.component.html',
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService) { }

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();
    this.model.email = this.authenticationService.getEmail();
    if ( this.model.email === 'review@example.org')
      this.model.password = 'password';
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
    this.loading = true;
    this.authenticationService.signIn(this.model.email, this.model.password)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.loading = false;
          throw error;
        });
  }
}
