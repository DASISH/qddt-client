import { AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { Password, UserService } from '../../../lib';


@Component({
  selector: 'qddt-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {

  public formData = { email: '', password: '' };
  public formId = Math.round( Math.random() * 10000);
  public loading = false;
  private instance;

  constructor(private router: Router, private authenticationService: UserService) {
    authenticationService.loggedIn.subscribe( (status) =>  {
      if (status) { this.instance.close(); }
    });
  }

  ngOnInit(): void {
    this.instance = M.Modal.init(document.querySelector('#modalLogin'),
      { inDuration: 400, outDuration: 300, startingTop: '4%', endingTop: '25%'});
    this.formData.email = this.authenticationService.getEmail();
  }

  ngAfterViewInit(): void {
    this.instance.open();
    M.updateTextFields();
  }

  login() {
    this.loading = true;
    this.authenticationService.signIn(new Password(this.formData)).then(
      () => {
        // document.querySelector('#password').classList.remove('invalid');
        this.instance.close(); },
      (error) => {
        document.querySelector('#password').classList.add('invalid');
        document.querySelector('.helper-text')
        .setAttribute('data-error', error.error['exceptionMessage']);
      },
    ).then(() => this.loading = false);
  }

}
