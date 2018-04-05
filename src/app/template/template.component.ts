import { AfterContentChecked, Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HEADER_DETAILS } from '../shared/elementinterfaces/headerdetail';
import { IEntityAudit } from '../shared/elementinterfaces/entityaudit';
import { ElementKind } from '../shared/elementinterfaces/elements';
import { Factory } from '../shared/elementfactory/factory';

declare var Materialize: any;

@Component({
  selector: 'qddt-template-component',
  moduleId: module.id,
  providers: [],
  templateUrl: './template.component.html',
})

export class TemplateComponent implements AfterContentChecked {

  public icon: any;
  public headerName: string;
  public newItem: IEntityAudit;
  public showForm = false;
  private kind: ElementKind;


  constructor( private route: ActivatedRoute ) {
    this.route.url.subscribe((event) => {
      const path = this.route.firstChild.routeConfig.path;
      this.kind = HEADER_DETAILS.get(path).kind;
      this.icon = HEADER_DETAILS.get(path).icon;
      this.headerName =  HEADER_DETAILS.get(path).headerName;
    });
  }


  ngAfterContentChecked(): void {
    Materialize.updateTextFields();
  }

  onToggleForm() {
    this.showForm = !this.showForm;
    if (this.showForm ) {
      this.newItem = Factory.createInstance(this.kind);
    }
  }
}
