import { AfterContentChecked, Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

declare var Materialize: any;

@Component({
  selector: 'qddt-home',
  moduleId: module.id,
  providers: [AuthService],
  templateUrl: './home.component.html',
})

export class HomeComponent implements AfterContentChecked {


  ngAfterContentChecked(): void {
    Materialize.updateTextFields();
  }
}
