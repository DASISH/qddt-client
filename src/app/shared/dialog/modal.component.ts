import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Component({
    selector: 'qddt-modal',
    moduleId: module.id,
    exportAs: 'modal',
    templateUrl: './modal.component.html',
    // styleUrls: ['./modal.component.css']
  })
export class ModalComponent {
    @Output() modalClose: EventEmitter<any> = new EventEmitter<any>();

    constructor( private router: Router ) {
      console.log('ModalComponent CNSTR');
    }

    closeModal( $event ) {
      // this.router.navigateByUrl(this.urlOnClose);
      this.router.navigate([{ outlets: { modal: null }}]);
      this.modalClose.next($event);
    }
}

