import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Password, UserService } from '../../../lib';


@Component({
  selector: 'qddt-resetpassword',
  templateUrl: './resetpassword.component.html'
})
export class ResetpasswordComponent implements AfterViewInit {

  public loading = false;
  private instance: M.Modal;

  constructor(private route: ActivatedRoute, private router: Router, private authenticationService: UserService) { }

  register(f) {
    this.loading = true;
    this.authenticationService.resetPassword(new Password(f)).subscribe(
      (result) => { M.toast({ html: result.message, displayLength: 5000 }); },
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
        inDuration: 400, outDuration: 300, startingTop: '4%', endingTop: '25%', preventScrolling: true,
        onOpenEnd: () => M.updateTextFields(),
        onCloseEnd: () => this.router.navigate([{ outlets: { popup: null } }])
      });
    this.instance.open();
  }

}
