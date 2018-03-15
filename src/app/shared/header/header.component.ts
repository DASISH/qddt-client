import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'qddt-header',
  moduleId: module.id,
  template: `
  <div class="row teal z-depth-1" style="padding-left: 2%; padding-top: 1%; padding-bottom: 1%;">
  <i class="material-icons large right">{{ headericon }}</i>
  <h4>{{ headername }}</h4>
  <a class="btn" (click)="onToggleNewForm()">
    <i class="material-icons right" *ngIf="!isNewFormVisible">keyboard_arrow_down</i>
    <i class="material-icons right" *ngIf="isNewFormVisible">keyboard_arrow_up</i> New
  </a>
  </div>`,
  providers: []
})
export class HeaderComponent  {
    @Input() headername: any;
    @Input() headericon: any;

    @Output() showform = new EventEmitter<boolean>();

    public isNewFormVisible: boolean;

    onToggleNewForm() {
        this.showform.emit(this.isNewFormVisible);
    }

}





