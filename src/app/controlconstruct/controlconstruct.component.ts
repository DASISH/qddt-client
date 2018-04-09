import { AfterContentChecked, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HEADER_DETAILS } from '../shared/elementinterfaces/headerdetail';
import { QuestionConstruct } from './controlconstruct.service';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';
import { Factory } from '../shared/elementfactory/factory';
import { ElementKind } from '../shared/elementinterfaces/elements';

declare var Materialize: any;

@Component({
  selector: 'qddt-control-construct',
  moduleId: module.id,
  providers: [],
  templateUrl: './controlconstruct.component.html',
})

export class ControlConstructComponent  implements AfterContentChecked {

  public icon: any;
  public headerName: string;
  public newItem: IEntityAudit;
  public showForm = false;
  public kind: ElementKind;


  constructor( private route: ActivatedRoute ) {
    this.route.url.subscribe((event) => {
      const path = this.route.firstChild.routeConfig.path;
      const header = HEADER_DETAILS.get(path);
      this.icon = header.icon;
      this.headerName =  header.headerName;
      this.kind = header.kind;
    });
  }



  ngAfterContentChecked(): void {
    try {
      Materialize.updateTextFields();
    } catch ( Exception ) {
       // ignore
    }
  }

  onToggleForm() {
    this.showForm = !this.showForm;
    this.newItem =  Factory.createInstance(this.kind);
  }
}
