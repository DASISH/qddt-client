import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { Password } from '../classes';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {

  public formData = { email: '', password: '' };
  public formId = Math.round( Math.random() * 10000);
  public loading = false;

  constructor(private router: Router, private authenticationService: UserService) {
    authenticationService.loggedIn.subscribe( (status) =>  {
      if (status) { $('#modalLogin').modal('close'); }
    });
  }


  login() {
    this.loading = true;
    this.authenticationService.signIn(new Password(this.formData)).then(
      () => {
        $('#pwRef').removeClass('invalid');
        $('#modalLogin').modal('close'); },
      (error) => {
        $('#pwRef')[0].labels[0].setAttribute('data-error', error.error['exceptionMessage']);
        $('#pwRef').addClass('invalid'); },
    ).then(() => this.loading = false);
  }

  ngOnInit(): void {
    this.formData.email = this.authenticationService.getEmail();
  }

  ngAfterViewInit(): void {
    $('.modal').modal({
      inDuration: 400, // Transition in duration
      outDuration: 300, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '25%', // Ending top style attribute
      ready: () => {
        Materialize.updateTextFields();
      },
      complete: () => {
        // router.navigate([{ outlets: { popup : null }}]);
      }
    });
    $('#modalLogin').modal('open');
  }
}
