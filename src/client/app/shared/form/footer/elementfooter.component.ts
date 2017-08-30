import { Component, Input, EventEmitter, Output } from '@angular/core';
// import { MaterializeAction } from 'angular2-materialize/dist';
// import { ElementFooterService } from './elementfooter.service';

@Component({
  selector: 'qddt-element-footer',
  moduleId: module.id,
  styles:  [
    'p {padding: 3px ;margin: inherit;!important;}',
    '.input-field label.active {padding-top:3px; !important;}'
  ],
  templateUrl: './elementfooter.component.html',
  providers: []
})
export class ElementFooterComponent {

  @Input() element: any;
  @Input() type: string;
  @Output() BasedonObjectDetail: any = new EventEmitter<any>();
  basedon: any;

  constructor() {
    this.basedon = null;
  }

  onClick(id: string, rev:string,type:string) {
    console.info('onClick ' + id + '-' + rev + '-' + type);
    this.BasedonObjectDetail.emit({id, rev, type});
  }

  getTime(): string {
    let m = this.element.modified;
    let date = new Date(Date.UTC(parseInt(m[0]),parseInt(m[1]),parseInt(m[2]),parseInt(m[3]),parseInt(m[4]),parseInt(m[5])));
    return date.toISOString();
  }

  getVersion(): string {
    let v = this.element.version;
    let rev =(v.revision!==null)?  '.' + v.revision :'';
    let label =(v.label!==undefined)?  ' - ' + v.label:'';
    return v.major + '.' + v.minor + rev + label;
  }

}
