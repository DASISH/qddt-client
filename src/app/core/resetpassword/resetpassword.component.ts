import { Component, AfterContentChecked } from '@angular/core';
import { UserService, IPassword, ResetPassword } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-resetpassword',

  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent implements AfterContentChecked {

  public loading = false;
  private once = 0;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {

    $(document).ready(function() {
      $('.modal').modal({
        ready: function(modal) {
          Materialize.updateTextFields();
        },
        complete: function(modal) {
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
    this.authenticationService.resetPassword(pwd).subscribe(
      (result) => {
        this.loading = false;
        $('#modalReset').modal('close');
        alert(result.message);
       },
       (error) => { this.loading = false; throw error; }
    );
  }
}
