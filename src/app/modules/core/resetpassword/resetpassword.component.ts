import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { toast } from 'materialize-css';

import { Password, UserService } from '../../../lib';


@Component({
  selector: 'qddt-resetpassword',
  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent implements AfterViewInit {

  public loading = false;
  private instance: M.Modal;

  constructor(private router: Router, private authenticationService: UserService) { }

  register(f) {
    this.loading = true;
    this.authenticationService.resetPassword(new Password(f)).subscribe(
      (result) => { toast({ html: result.message, displayLength: 5000 }); },
      (error) => { throw error; },
      () => this.loading = false
    );
  }

  onClose() {
    this.instance.close();
  }

  ngAfterViewInit(): void {
    this.instance = M.Modal.init(document.getElementById('modalReset'),
      {
        inDuration: 750, outDuration: 1000, startingTop: '75%', endingTop: '25%', preventScrolling: true,
        onOpenEnd: () => M.updateTextFields(),
        onCloseEnd: () => this.router.navigate([{ outlets: { popup: null } }])
      });
    this.instance.open();
  }

}
