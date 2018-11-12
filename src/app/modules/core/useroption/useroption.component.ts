import {AfterViewInit, Component} from '@angular/core';
import { Router } from '@angular/router';
import { PropertyStoreService } from '../services/property.service';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-useroption',
  templateUrl: './useroption.component.html'
})
export class UserOptionComponent  implements AfterViewInit {


  public formId = Math.round( Math.random() * 10000);
  public items = [ { name: 'pageSize', type: 'number' }, { name: 'email', type: 'email' } ];

  constructor(private router: Router, public qddtProperty: PropertyStoreService) {
    // $(document).ready(function() {
    //
    // });
  }

  onClose() {
    $('#userOption').modal('close');
  }

  ngAfterViewInit(): void {
    $('.modal').modal({
      ready: () => {
        Materialize.updateTextFields();
      },
      complete: () => {
        this.router.navigate([{ outlets: { popup : null }}]);
      }
    });
    $('#userOption').modal('open');
  }

}
