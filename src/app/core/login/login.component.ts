import { Component, AfterContentChecked, AfterContentInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent implements  AfterContentInit {

  public formData = { email: null, password: null };

  loading = false;
  once = 0;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
    $(document).ready(function() {
      $('.modal').modal({
        ready: function(modal) {
          Materialize.updateTextFields();
        },
        complete: function(modal) {
          console.log(modal);
        }
      });
      $('#modalLogin').modal('open');
    });
  }

  ngAfterContentInit(): void {
    this.formData.email = this.authenticationService.getEmail();
  }


  login(f) {
    this.loading = true;
    this.authenticationService.signIn(this.formData.email, this.formData.password).then(
        () => { console.log('login successful');  this.loading = false;  $('.modal').modal(); $('#modalLogin').modal('close'); },
        (error) => { this.loading = false; throw error; }
        );
  }
}
