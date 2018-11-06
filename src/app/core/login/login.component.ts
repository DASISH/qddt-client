import {Component, OnInit} from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  public formData = { email: '', password: '' };

  loading = false;

  constructor(private router: Router, private authenticationService: UserService) {
    $(document).ready(function() {
      $('.modal').modal({
        ready: () => {
          Materialize.updateTextFields();
        },
        complete: () => {
          // router.navigate([{ outlets: { popup : null }}]);
        }
      });
      $('#modalLogin').modal('open');
    });
  }


  login() {
    this.loading = true;
    this.authenticationService.signIn(this.formData.email, this.formData.password).then(
        () => {
          this.loading = false;
          $('#modalLogin').modal('close'); },
        (error) => { this.loading = false; throw error; }
        );
  }

  ngOnInit(): void {
    this.formData.email = this.authenticationService.getEmail();
  }
}
