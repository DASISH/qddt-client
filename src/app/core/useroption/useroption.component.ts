import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyStoreService } from '../services/property.service';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-useroption',
  templateUrl: './useroption.component.html'
})
export class UserOptionComponent {


  public formId = Math.round( Math.random() * 10000);
  public items = [ { name: 'pageSize', type: 'number' }, { name: 'email', type: 'email' } ];

  constructor(private router: Router, public qddtProperty: PropertyStoreService) {
    $(document).ready(function() {
      $('.modal').modal({
        ready: () => {
          Materialize.updateTextFields();
        },
        complete: () => {
          router.navigate([{ outlets: { popup : null }}]);
        }
      });
      $('#userOption').modal('open');
    });
  }

  onClose() {
    $('#userOption').modal('close');
  }

}
