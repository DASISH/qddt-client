import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService, Agency} from '../user/user.service';

@Component({
  selector: 'qddt-register',
  moduleId: module.id,
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  model = {name: '', password: '', email: '', agency: {} };
  agencies: Array<Agency> = [];
  loading = false;

  constructor(private authService: UserService, public router: Router ) {
  }

  ngOnInit() {
    this.authService.getAgencies().then((result) => {
        this.agencies = result;
      },
      (error: any) => {
        throw error;
      });
  }

  register() {
    this.loading = true;
    this.authService.registerUser(this.model).subscribe((result: any) => {
      this.loading = false;
      throw result;
    });
  }

  onClickAgency(value: Agency) {
      this.model.agency = value;
  }
}
