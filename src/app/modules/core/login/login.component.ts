import { delay } from 'src/app/lib';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Password, UserService } from '../../../lib';


@Component({
  selector: 'qddt-login',
  template: `
  <div id="login-1" class="modal" style="width:25%;">
    <div class="modal-content">
      <h4>Login</h4>
      <form (ngSubmit)="login()" (keyup.enter)="f.onSubmit($event)" #f="ngForm">
        <div class="row input-field">
          <input id="email-1"  class="validate" name="email" type="email" [(ngModel)]="formData.email" required>
          <label for="email-1">Email</label>
        </div>
        <div class="row input-field">
          <input id="password-1" class="validate" pattern=".{6,}"  name="password" type="password" [(ngModel)]="formData.password" required autofocus >
          <label for="password-1">Password</label>
          <span class="helper-text"></span>
        </div>
      </form>
      <div class="modal-footer" style="height: 56px;">
        <qddt-spinner [hidden]="!loading" ></qddt-spinner>
        <button [disabled]="f.invalid || loading" class="btn btn-primary waves-effect right" (click)="f.onSubmit($event)">Login</button>
      </div>
    </div>
  </div>
`
})
export class LoginComponent implements OnInit, AfterViewInit {
  public formData = { email: '', password: '' };
  public loading = false;

  private instance: M.Modal;

  constructor(private router: Router, private userService: UserService) {
  }

  ngOnInit(): void {
    this.formData.email = this.userService.getEmail();
    this.instance = M.Modal.init(document.getElementById('login-1'),
      {
        inDuration: 750, outDuration: 1000, startingTop: '75%', endingTop: '35%', preventScrolling: true,
        onOpenEnd: () => M.updateTextFields()
      });
  }

  ngAfterViewInit(): void {
    this.instance.open();
  }


  login() {
    this.loading = true;
    this.userService.signIn(new Password(this.formData)).then(
      () => {
        this.instance.close();
      },
      (error) => {
        document.getElementById('password-1').classList.add('invalid');
        document.querySelector('.helper-text')
          .setAttribute('data-error', error.error.exceptionMessage);
      },
    ).then(() => this.loading = false);
  }

}
