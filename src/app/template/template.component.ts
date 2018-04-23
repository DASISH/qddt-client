import { OnChanges, Component, SimpleChanges, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QddtMessageService } from '../core/global/message.service';
import { Factory } from '../shared/classes/factory';
import { IEntityEditAudit, IPageSearch } from '../shared/classes/interfaces';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';
import { TemplateService } from './template.service';
import { QddtPropertyStoreService } from '../core/global/property.service';
import { ResponseDomain } from '../responsedomain/responsedomain.classes';

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
  private path: string;


  constructor( private route: ActivatedRoute,  private  messages: QddtMessageService, private service: TemplateService,
    private properties: QddtPropertyStoreService ) {
    this.route.url
    .takeWhile(() => this.alive)
    .subscribe((event) => {
      this.path = this.route.firstChild.routeConfig.path;
      if (HEADER_DETAILS.has(this.path)) {
        this.kind = HEADER_DETAILS.get(this.path).kind;
        this.icon = HEADER_DETAILS.get(this.path).icon;
        this.headerName =  HEADER_DETAILS.get(this.path).headerName;
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
        const page: IPageSearch =  this.properties.get(this.path);
        this.newItem = Factory.createInstance(this.kind);
        if (page.kind === ElementKind.RESPONSEDOMAIN) {
          (this.newItem as ResponseDomain).responseKind = page.keys['ResponseKind'];
        }

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
