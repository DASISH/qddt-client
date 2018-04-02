import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'qddt-show-onfocus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'search-select-item.component.html'
})
export class ShowOnFocustComponent {
  @Input() readonly = false;
  @Input() itemName: string;
  @Output() searchEvent =  new EventEmitter<any>();

  showButton = false;
  showAddItem = false;
}
