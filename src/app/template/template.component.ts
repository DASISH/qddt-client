import { OnChanges, Component, SimpleChanges, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QddtMessageService } from '../core/global/message.service';
import { Factory } from '../shared/classes/factory';
import { IEntityEditAudit } from '../shared/classes/interfaces';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';
import { TemplateService } from './template.service';

declare var Materialize: any;

@Component({
  selector: 'qddt-template-component',
  moduleId: module.id,
  providers: [],
  templateUrl: './template.component.html',
})

export class TemplateComponent implements OnChanges, OnDestroy {

  public readonly formId = Math.round( Math.random() * 10000);
  public newItem: IEntityEditAudit;

  public icon: any;
  public headerName: string;
  public showForm = false;
  private kind: ElementKind;
  private alive = true;


  constructor( private route: ActivatedRoute,  private  messages: QddtMessageService, private service: TemplateService ) {
    this.route.url
    .takeWhile(() => this.alive)
    .subscribe((event) => {
      const path = this.route.firstChild.routeConfig.path;
      if (HEADER_DETAILS.has(path)) {
        this.kind = HEADER_DETAILS.get(path).kind;
        this.icon = HEADER_DETAILS.get(path).icon;
        this.headerName =  HEADER_DETAILS.get(path).headerName;
      }
    });
  }

  public canWrite(): boolean {
    return this.service.can(ActionKind.Create, this.kind);
  }


  onToggleForm() {
    if (this.canWrite ) {
      this.showForm = !this.showForm;
      if (!this.showForm) {
        this.messages.sendAction(  { id: '', action: ActionKind.Update, object: null });
      }
      if (this.showForm ) {
        this.newItem = Factory.createInstance(this.kind);
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    try { Materialize.updateTextFields(); } catch (Exception) { }
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
