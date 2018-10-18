import { Component, AfterContentInit, AfterContentChecked } from '@angular/core';
import { UserService, IPassword, ResetPassword } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-resetpassword',
  moduleId: module.id,
  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent implements AfterContentChecked {

  public formData: IPassword = { id: null, oldPassword: null, password: null, confirm: null };
  public loading = false;
  public errorlabel = 'TESTES';

  private once = 0;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {
    console.log('not ready');

    $(document).ready(function() {
      console.log('ready');
      $('.modal').modal({
        ready: function(modal) {
          console.log(modal);
          Materialize.updateTextFields();
        },
        complete: function(modal) {
          console.log(modal);
        }
      });
      $('#modalReset').modal('open');
    });
  }


  ngAfterContentChecked(): void {
    if (this.once < 10) {
      this.once ++;
      try {
        // Materialize.updateTextFields();
      } catch  {
        // console.log('Materialize not initialized...');
      }
    }
  }

  register(f) {
    const pwd = new ResetPassword(f);
    this.loading = true;
    this.authenticationService.resetPassword(pwd).subscribe((result: any) => {
      this.loading = false;  $('.modal').modal(); $('#modalReset').modal('close');
      throw result;
    });
  }
}
