import { AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { Password, UserService } from '../../../lib';


@Component({
  selector: 'qddt-login',
  template:
`
<div id="FORM-{{formId}}" class="modal" style="width:25%;">
  <div class="modal-content">
    <h4>Login</h4>
    <form class="" (ngSubmit)="login()" (keyup.enter)="f.onSubmit()" #f="ngForm">
      <div class="row input-field">
        <input class="validate" name="email" type="email" [(ngModel)]="formData.email" required email tabindex="1">
        <label class="active">Email</label>
      </div>
      <div class="row input-field">
        <input id="password" class="validate" pattern=".{6,}"  name="password" type="password" [(ngModel)]="formData.password" required autofocus tabindex="2">
        <label>Password</label>
        <span class="helper-text"></span>
      </div>
    </form>
    <div class="modal-footer" style="height: 56px;">
      <qddt-spinner [hidden]="!loading" ></qddt-spinner>
      <button [disabled]="f.invalid || loading" class="btn btn-primary waves-effect right" tabindex="3" (click)="f.onSubmit()">Login</button>
    </div>
  </div>
</div>
`
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
    this.formData.email = this.authenticationService.getEmail();
  }

  ngAfterViewInit(): void {
    this.instance = M.Modal.init(document.querySelector('#FORM-' + this.formId),
      { inDuration: 400, outDuration: 300, startingTop: '4%', endingTop: '25%', preventScrolling: true});
    this.instance.open();
  }


  login() {
    this.loading = true;
    this.authenticationService.signIn(new Password(this.formData)).then(
      () => {
        this.instance.close(); },
      (error) => {
        document.querySelector('#password').classList.add('invalid');
        document.querySelector('.helper-text')
        .setAttribute('data-error', error.error['exceptionMessage']);
      },
    ).then(() => this.loading = false);
  }

}
