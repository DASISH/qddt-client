import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MaterializeAction } from 'angular2-materialize/dist';
import { ElementFooterService } from './elementfooter.service';

@Component({
  selector: 'qddt-element-footer',
  moduleId: module.id,
  styles:  [
    'p {padding: 3px ;margin: inherit;!important;}',
    '.input-field label.active {padding-top:3px; !important;}'
  ],
  templateUrl: './elementfooter.component.html',
  providers: [ElementFooterService]
})
export class ElementFooterComponent {

  @Input() element: any;
  @Input() type: string;
  @Output() BasedonObjectDetail: any = new EventEmitter<any>();
  elementActions = new EventEmitter<string|MaterializeAction>();
  id: any;
  basedon: any;

  constructor(private service: ElementFooterService) {
    this.basedon = null;
  }

  onClick(id: string, rev:string) {
    console.info('onClick ' + id + '-' + rev);
    this.id = id;
    this.BasedonObjectDetail.emit({id, rev});
      // this.service.getelement(this.type, this.id, rev)
      //   .subscribe(
      //   (result: any) => {
      //     this.basedon = result;
      //     this.elementActions.emit({action:'modal', params:['open']});
      //   },
      //   (err: any) => {
      //   }
      // );
  }

}
