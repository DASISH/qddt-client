import {AfterViewInit, Component} from '@angular/core';
import { Router } from '@angular/router';
import { PropertyStoreService } from '../services';

declare var Materialize: any;
declare var $;

@Component({
  selector: 'qddt-useroption',
  templateUrl: './useroption.component.html'
})
export class UserOptionComponent  implements AfterViewInit {


  public formId = Math.round( Math.random() * 10000);
  public items = [ { name: 'pageSize', type: 'number', class: 'validate' },
                  { name: 'email', type: 'email', class: 'validate' },
                  { name: 'ISO 639-1 Language Code', type: 'text', class: 'autocomplete' }  ];

  constructor(private router: Router, public qddtProperty: PropertyStoreService) { }

  onClose() {
    $('#userOption').modal('close');
  }

  ngAfterViewInit(): void {
    // const id = 'language' + this.formId;
    // const auto = <HTMLInputElement>document.getElementById(id);
    // auto.list = 'languages';
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
