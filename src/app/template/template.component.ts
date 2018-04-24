import { OnChanges, Component, SimpleChanges, OnDestroy, AfterContentChecked} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QddtMessageService } from '../core/global/message.service';
import { Factory } from '../shared/classes/factory';
import { IEntityEditAudit, IPageSearch } from '../shared/classes/interfaces';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';
import { TemplateService } from './template.service';
import { QddtPropertyStoreService } from '../core/global/property.service';
import { ResponseDomain, DomainKind } from '../responsedomain/responsedomain.classes';

declare var Materialize: any;

@Component({
  selector: 'qddt-template-component',
  moduleId: module.id,
  providers: [],
  styles: [
    ' .input-field *  { color: white; } '
  ],
  templateUrl: './template.component.html',
})

export class TemplateComponent implements OnChanges, OnDestroy, AfterContentChecked {

  public readonly formId = Math.round( Math.random() * 10000);
  public newItem: IEntityEditAudit;

  public icon: any;
  public headerName: string;
  public showForm = false;
  private kind: ElementKind;
  private alive = true;
  private path: string;
  private refreshCount = 0;


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

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {
      }
    }
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
        this.refreshCount = 0;
        const page: IPageSearch =  this.properties.get(this.path);
        this.newItem = Factory.createInstance(this.kind);
        if (page.kind === ElementKind.RESPONSEDOMAIN) {
          (this.newItem as ResponseDomain).setResponseKind(DomainKind[page.keys.get('ResponseKind')]);
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
