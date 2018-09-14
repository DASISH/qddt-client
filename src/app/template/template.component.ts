
import {takeWhile} from 'rxjs/operators';
import { Component, OnDestroy, AfterContentChecked} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QddtMessageService } from '../core/global/message.service';
import { Factory } from '../shared/classes/factory';
import { IEntityEditAudit, IPageSearch } from '../shared/classes/interfaces';
import { ActionKind, ElementKind } from '../shared/classes/enums';
import { HEADER_DETAILS } from '../shared/classes/constants';
import { QddtPropertyStoreService } from '../core/global/property.service';
import { ResponseDomain, DomainKind } from '../responsedomain/responsedomain.classes';
import { UserService } from '../core/user/user.service';

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

export class TemplateComponent implements OnDestroy, AfterContentChecked {

  public readonly formId = Math.round( Math.random() * 10000);
  public newItem: IEntityEditAudit;

  public icon: any;
  public headerName: string;
  public showForm = false;
  private kind: ElementKind;
  private alive = true;
  private path: string;
  private refreshCount = 0;


  constructor( private route: ActivatedRoute,  private  messages: QddtMessageService, private service: UserService,
    private properties: QddtPropertyStoreService ) {
    this.route.url.pipe(
    takeWhile(() => this.alive))
    .subscribe((event) => {
      this.path = this.route.firstChild.routeConfig.path; // '/:id'
      // console.log('path1-> ' + this.path);
      const detailIndex = this.path.lastIndexOf('/:id');
      if (detailIndex >= 0) {
        this.path = this.path.substr(0, detailIndex);
      }
      // console.log('path2-> ' + this.path);
      if (HEADER_DETAILS.has(this.path)) {
        this.kind = HEADER_DETAILS.get(this.path).kind;
        this.icon = HEADER_DETAILS.get(this.path).icon;
        this.headerName =  HEADER_DETAILS.get(this.path).headerName;
      }
    });

    this.messages.getAction().pipe(
      takeWhile(() => this.alive))
      .subscribe(event => {
        if (event.action === ActionKind.Filter
          && (event.id === 'ResponseKind' || event.id === 'publishedstatus' ) ) {
          if (this.showForm) { this.onToggleForm(); }
          if (event.id === 'ResponseKind') {
            // TODO go to response List
          } else {
            // TODO go to publised List
          }
        }
      });
  }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 10) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) { }
    }
  }

  public canWrite(): boolean {
    return this.service.canDo(ActionKind.Create, this.kind);
  }


  onToggleForm() {
    if (!this.canWrite()) { throw Error('Access denied'); }

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


  ngOnDestroy(): void {
    this.alive = false;
  }

}
