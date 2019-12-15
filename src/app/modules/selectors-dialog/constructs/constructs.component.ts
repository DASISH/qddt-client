import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import { ActionKind } from 'src/app/lib';
import { CONSTRUCT_MAP,
        ElementKind, ElementRevisionRef,
        getIcon,
        IElement, IRevisionRef,
        MessageService,
        TemplateService} from '../../../lib';


@Component({
  selector: 'qddt-constructs',
  styles: [
          '.qlabel { padding-top: 5px; }',
          '.collection a.collection-item { cursor: pointer; padding-left: 10px;}',
   ],
  template: `
  <div class="collection with-header hoverable row" (mouseenter)="showButton = !readonly"  (mouseleave)="showButton = false">

    <a class="collection-header col s12"  (click)="onItemNew($event)" style="cursor: zoom-in">
      <label><i class="material-icons small">format_line_spacing</i>Sequence</label>
      <a *ngIf="showButton" class="secondary-content btn-flat btn-floating btn-small waves-effect waves-light teal">
        <i class="material-icons" title="add Item">playlist_add</i>
      </a>
    </a>
    <a class="collection-item col s12 black-text" *ngFor="let cqi of revisionRefs.sort()" (click)="onItemPreview($event,cqi)" >
    <qddt-version-label class="secondary-content" [revisionRef]="cqi" ></qddt-version-label>
      <ul *ngIf="!readonly" class="dropleft">
        <li>
          <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 green" (click)="onItemEdit($event,cqi)">
            <i class="material-icons" title="Edit question">edit</i>
          </a>
        </li>
        <li>
          <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 blue" (click)="onItemUpdate($event, cqi)">
            <i class="material-icons" title="update selected">sync</i>
          </a>
        </li>
        <li>
          <a class="btn-flat btn-floating btn-small waves-effect waves-light lighten-2 red" (click)="onItemRemove($event, cqi)">
            <i class="material-icons" title="Remove selected">remove</i>
          </a>
        </li>
      </ul>
      <div class="question">
          <i class="material-icons small">{{getMatIcon(cqi.elementKind)}}</i>{{cqi?.name}}
      </div >
    </a>
  </div>

  <!-- Modal Structure -->
  <div  id="MODAL-{{modalId}}" class="modal modal-fixed-footer">
    <div class="modal-content" >
      <h4>Select version</h4>
      <div class="card-action">
        <div class="row">
          <div class="col left" *ngFor="let option of selectOptions" >
            <label>
              <input name="DOMAIN-TYPE-GROUP" type="radio" [checked]="selectId === option.id" (click)="onSelectOption(option.value)" />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
      <qddt-element-revision-select
          [source] = "SOURCE"
          (revisionSelectedEvent)="revisionSelectedEvent($event)"
          (dismissEvent) ="onDismiss()">
      </qddt-element-revision-select>
    </div>
    <div class="modal-footer">
      <a class="btn red waves-effect waves-red" (click)="onDismiss($event)" >Dismiss</a>
    </div>
  </div>
`,
})
export class ConstructsComponent {
  @Input() revisionRefs: ElementRevisionRef[];
  @Input() readonly = true;
  @Output() actionEvent = new EventEmitter<{ action: ActionKind , ref: ElementRevisionRef }>();

  public readonly modalId = Math.round( Math.random() * 10000);
  public readonly selectOptions = CONSTRUCT_MAP;
  public selectId = 0;
  public SOURCE: IElement| IRevisionRef| null;
  // tslint:disable-next-line:variable-name
  private _modalRef: M.Modal;
  // tslint:disable-next-line:variable-name
  private _ShowRef = false;
  // tslint:disable-next-line:variable-name
  private _showButton = false;
  private action = ActionKind.Create;

  constructor(private service: TemplateService, public message: MessageService, private router: Router ) {
    console.log(this.selectOptions || JSON);
  }

  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {
    if (value) {
      this._ShowRef = true;
    }
    this._showButton = value;
  }

  get showRevision(): boolean { return this._ShowRef; }

  get modalRef(): M.Modal {
    if (!(this._modalRef)) {
      this._modalRef = M.Modal.init(document.querySelector('#MODAL-' + this.modalId));
    }
    return this._modalRef;
  }

  public revisionSelectedEvent(ref: ElementRevisionRef) {
    this.actionEvent.emit( {action: this.action, ref });
    this.SOURCE = null;
    this.modalRef.close();
  }

  public onDismiss(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.SOURCE = null;
    this.modalRef.close();
  }

  public onItemNew(event: Event) {
    event.stopPropagation();
    this.action = ActionKind.Create;
    this.modalRef.open();
  }

  public onItemRemove(event: Event, ref: ElementRevisionRef) {
    event.stopPropagation();
    this.actionEvent.emit( {action: ActionKind.Delete, ref });
  }

  public onItemEdit(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.service.searchByUuid(cqi.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw  error; });
  }

  public onItemUpdate(event: Event, cqi: ElementRevisionRef) {
    event.stopPropagation();
    this.action = ActionKind.Update;
    this.SOURCE = cqi;
    this.modalRef.open();
  }

  public onItemPreview(event: Event, item: ElementRevisionRef) {
    event.stopPropagation();
    this.message.sendMessage(item);
  }

  public onSelectOption(value) {
    this.SOURCE = { element: '', elementKind: value };
    console.log(this.SOURCE);
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

}
