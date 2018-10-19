import {Component, AfterContentInit, OnInit} from '@angular/core';
import { UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-login',
  moduleId: module.id,
  templateUrl: './login.component.html'
})
export class LoginComponent implements  AfterContentInit, OnInit {

  public formData = { email: null, password: null };

  loading = false;
  once = 0;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
    console.log ('login cnstr');
  }

  ngOnInit(): void {
    console.log ('login init');
    $(document).ready(function() {
      $('.modal').modal({
        ready: () => {
          Materialize.updateTextFields();
        },
        complete: () => {
          console.log('login -> event complete');
        }
      });
      $('#modalLogin').modal('open');
    });
  }

  ngAfterContentInit(): void {
    console.log ('login ngAfterContentInit');
    this.formData.email = this.authenticationService.getEmail();
    console.log ('login ngAfterContentInit -done');
  }


  login(f?) {
    this.loading = true;
    this.authenticationService.signIn(this.formData.email, this.formData.password).then(
        () => {
          console.log('login successful');
          this.loading = false;
          $('.modal').modal();
          $('#modalLogin').modal('close'); },
        (error) => { this.loading = false; throw error; }
        );
  }
}
