import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { PropertyStoreService } from '../../../lib/services';
import { delay } from 'src/app/lib';

@Component({
  selector: 'qddt-useroption',
  templateUrl: './useroption.component.html'
})
export class UserOptionComponent implements AfterViewInit {

  public formId = Math.round(Math.random() * 10000);
  public items = [
    { label: 'pageSize', name: 'pageSize', type: 'number', class: 'validate' },
    { label: 'email', name: 'email', type: 'email', class: 'validate' },
    { label: 'ISO 639-1 Language Code', name: 'xmlLang', type: 'text', class: 'autocomplete' }];

  private instance: M.Modal;

  constructor(private router: Router, public qddtProperty: PropertyStoreService) { }


  onClose() {
    this.instance.close();
  }

  ngAfterViewInit(): void {
    this.instance = M.Modal.init(document.getElementById('userOption-00'),
      {
        inDuration: 400, outDuration: 300, startingTop: '4%', endingTop: '25%', preventScrolling: true,
        onOpenEnd: () => M.updateTextFields(),
        onCloseEnd: () => this.router.navigate([{ outlets: { popup: null } }])
      });
    this.instance.open();
  }

}
