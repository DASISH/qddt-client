import { hasChanges } from 'src/app/lib';
import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Category, DomainKind, ResponseCardinality, ResponseDomain, UserResponse, Parameter } from '../../../lib';

@Component({
  selector: 'qddt-preview-responsedomain',
  template: `
  <ng-container *ngIf="responseDomain">
    <div *ngIf="responseType" class="row card-panel grey lighten-5 grey-text text-darken-1">
      <span *ngIf="responseType !== refKind.MIXED && showLabel">
          {{ responseDomain?.name }}(V<qddt-version [element]="rep"></qddt-version>)
      </span>
      <ng-container [ngSwitch]="responseType">
        <qddt-preview-rd-mixed *ngSwitchCase="refKind.MIXED"
          [managedRepresentation]="rep"
          [displayLayout]="displayLayout"
          [responseCardinality]="cardinality"
          (selectedEvent)="onSelectedEvent($event)">
        </qddt-preview-rd-mixed>
        <qddt-preview-rd-scale  *ngSwitchCase=refKind.SCALE
          [managedRepresentation]="rep"
          [displayLayout]="displayLayout"
          (selectedEvent)="onSelectedEvent($event)">
        </qddt-preview-rd-scale>
        <qddt-preview-rd-codelist  *ngSwitchCase=refKind.LIST
          [managedRepresentation]="rep"
          [inputGroupName]="responseDomain.name"
          [responseCardinality]="cardinality"
          (selectedEvent)="onSelectedEvent($event)">
        </qddt-preview-rd-codelist>
        <qddt-preview-rd-datetime  *ngSwitchCase="refKind.DATETIME"
          [managedRepresentation]="rep"
          (selectedEvent)="onSelectedEvent($event)">
        </qddt-preview-rd-datetime>
        <qddt-preview-rd-numeric  *ngSwitchCase="refKind.NUMERIC"
          [managedRepresentation]="rep"
          (selectedEvent)="onSelectedEvent($event)">
        </qddt-preview-rd-numeric>
        <qddt-preview-rd-text  *ngSwitchCase="refKind.TEXT"
          [managedRepresentation]="rep"
          (selectedEvent)="onSelectedEvent($event)">
        </qddt-preview-rd-text>
        <qddt-preview-rd-missing  *ngSwitchCase="refKind.MISSING"
          [inputGroupName]="responseDomain.name"
          [missingSelected]="missingSelected"
          (selectedEvent)="onSelectedEvent($event)">
        </qddt-preview-rd-missing>
      </ng-container>
      <div class="right"  style="font-size: 0.8rem;" *ngIf="!missingSelected"
        [ngClass]="{'red-text': responseDomain.responseCardinality.minimum > checked, 'green-text': responseDomain.responseCardinality.minimum <= checked }" >
        <em>Response Cardinality ({{checked}}): valid from {{responseDomain.responseCardinality.minimum}} to {{responseDomain.responseCardinality.maximum}}</em>
      </div>
      <div class="right green-text" style="font-size: 0.8rem;" *ngIf="missingSelected">
        <em>Response Cardinality ({{checked}}): missing is valid </em>
      </div>
    </div>
  </ng-container>`,
  providers: [],
})

export class PreviewResponsedomainComponent implements OnChanges {
  @Input() responseDomain: ResponseDomain;
  @Input() showLabel = true;
  @Input() inParameters: Map<string, Parameter>
  @Input() parameterIn: Parameter[] = [];
  @Output() selectedEvent = new EventEmitter<UserResponse[]>();

  public refKind = DomainKind;
  public responseType: DomainKind;
  public cardinality: ResponseCardinality;
  public displayLayout: number;
  public rep: Category;
  public checked = 0;
  public missingSelected = false;
  // public compId = Math.round(Math.random() * 10000);

  public values: {};

  public ngOnChanges(changes: SimpleChanges) {
    if (hasChanges(changes.inParameters) && this.responseDomain) {
      console.log('inParameters');
      this.rep = this.insertParam(new Category(this.responseDomain.managedRepresentation));
    }
    if (hasChanges(changes.parameterIn) && this.responseDomain) {
      console.log('parameterIn');
      this.rep = this.insertParam(new Category(this.responseDomain.managedRepresentation));
    }
    if (hasChanges(changes.responseDomain)) {
      console.log('responseDomain');
      this.responseType = DomainKind[this.responseDomain.responseKind];
      this.rep = this.insertParam(new Category(this.responseDomain.managedRepresentation));
      this.cardinality = new ResponseCardinality(this.responseDomain.responseCardinality);
      this.displayLayout = +this.responseDomain.displayLayout;
    }
  }

  public onSelectedEvent(idxs: UserResponse[]) {
    this.checked = idxs.length;
    this.missingSelected = (idxs[0].isMissing);
    this.selectedEvent.emit(idxs);
  }

  public insertParam(root: Category): Category {
    if (root && this.parameterIn && this.inParameters) {
      this.parameterIn.forEach(p => {
        if (p.referencedId) {
          let value = this.inParameters.get(p.referencedId).value;
          if (value) {
            root.label = root.label.replace(
              new RegExp('\\[' + p.name + '\\]', 'ig'), '<mark>' + value.map(pp => (pp.label) ? pp.label : pp.value).join(',') + '</mark>');
          }
        }
      });
      root.children = root.children.map(child => this.insertParam(child));
    }
    console.log(root || JSON);
    return root;
  }
}
