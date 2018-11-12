import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { Password } from '../classes';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-resetpassword',
  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent  implements AfterViewInit {

  public loading = false;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) {  }

  register(f) {
    this.loading = true;
    this.authenticationService.resetPassword(new Password(f)).subscribe(
      (result) => { Materialize.toast(result.message, 5000); },
      (error) => { throw error; },
      () => this.loading = false
    );
  }

  onClose() {
    $('#modalReset').modal('close');
  }

  onChange(event: FocusEvent): void {
    console.log(JSON.stringify(event));
  }

  ngAfterViewInit(): void {
    $('.modal').modal({
      ready: () => {
        Materialize.updateTextFields();
      },
      complete: () => {
        this.router.navigate([{ outlets: { popup : null }}]);
      },
    });
    $('#modalReset').modal('open');
  }

}
