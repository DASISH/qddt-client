import {OnChanges, Component, SimpleChanges} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HEADER_DETAILS } from '../shared/elementinterfaces/headerdetail';
import { ElementKind } from '../shared/elementinterfaces/elements';
import { QddtMessageService } from '../core/global/message.service';
import { Action } from '../shared/elementinterfaces/detailaction';

declare var Materialize: any;

@Component({
  selector: 'qddt-template-component',
  moduleId: module.id,
  providers: [],
  templateUrl: './template.component.html',
})

export class TemplateComponent implements OnChanges {

  public icon: any;
  public headerName: string;
//  public newItem: IEntityAudit;
  public showForm = false;
  private kind: ElementKind;


  constructor( private route: ActivatedRoute,  private  messages: QddtMessageService ) {
    this.route.url.subscribe((event) => {
      const path = this.route.firstChild.routeConfig.path;
      this.kind = HEADER_DETAILS.get(path).kind;
      this.icon = HEADER_DETAILS.get(path).icon;
      this.headerName =  HEADER_DETAILS.get(path).headerName;
    });
  }

  onToggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.messages.sendAction(  { id: '', action: Action.Update, object: null });
    }
//    if (this.showForm ) {
// this.newItem = Factory.createInstance(this.kind);
//    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    try { Materialize.updateTextFields(); } catch (Exception) { }
  }
}
