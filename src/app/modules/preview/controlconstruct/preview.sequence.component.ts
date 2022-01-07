import { Component, Input, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import {
  ElementKind, ElementRevisionRefImpl, getElementKind, getIcon,
  AbstractControlConstruct, PreviewService, SequenceConstruct, Parameter, hasChanges
} from '../../../lib';



@Component({
  selector: 'qddt-preview-sequenceconstruct',
  template: `
<ng-container *ngIf="sequenceConstruct">

  <qddt-parameter [outParameters]="sequenceConstruct.parameters" [showParameters]="true"></qddt-parameter>

  <ng-container *ngTemplateOutlet="sequenceConstructTmpl; context:{ sequence: sequenceConstruct,  counter: 1 }"></ng-container>

  <ng-template #sequenceConstructTmpl let-sequence="sequence" let-counter="counter">
    <ul [id]="'UL-' + compId + '-' + counter" *ngIf="sequence?.sequence" class="collapsible" >
      <li [id]="'LI-' + trackByIndex(idx,counter)" *ngFor="let cqi of sequence.sequence; trackBy:trackByIndex; let idx=index;" (click)="onOpenBody(cqi,'UL-' + compId + '-' + (counter+1))" >
        <div class="collapsible-header" >
          <i class="material-icons small teal-text text-lighten-3">{{getMatIcon(cqi.elementKind)}}</i>
          <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=cqi.name></div>
          <qddt-version-label  class="col s3 m2 right-align" [revisionRef]="cqi"></qddt-version-label>
        </div>
        <div class="collapsible-body">
          <ng-container [ngSwitch]="cqi.elementKind">
            <ng-container *ngSwitchCase="'SEQUENCE_CONSTRUCT'">

              <qddt-parameter [inParameters]="cqi.element?.parameterIn" [parameters]="inParameters" ></qddt-parameter>
              <ng-container *ngTemplateOutlet="sequenceConstructTmpl; context:{ sequence: cqi.element, counter: nextLevel(counter) }"></ng-container>
            </ng-container>
            <ng-container *ngSwitchCase="'CONDITION_CONSTRUCT'">
              <qddt-preview-conditionconstruct [construct]="cqi.element" [inParameters]="inParameters"></qddt-preview-conditionconstruct>
            </ng-container>
            <ng-container *ngSwitchCase="'STATEMENT_CONSTRUCT'">
              <qddt-preview-statementconstruct  [statement]="cqi.element" [inParameters]="inParameters"></qddt-preview-statementconstruct>
            </ng-container>
            <ng-container *ngSwitchCase="'QUESTION_CONSTRUCT'">
              <qddt-preview-questionconstruct  [controlConstruct]="cqi.element" [inParameters]="inParameters"></qddt-preview-questionconstruct>
            </ng-container>
            <ng-container *ngSwitchCase="'INSTRUCTION'">
              <div *ngIf="cqi?.element">
                <p [innerHtml]="cqi?.element['description']"></p>
              </div>
            </ng-container>
          </ng-container>
        </div>
      </li>
    </ul>
  </ng-template>
</ng-container>`,
})

export class PreviewSequenceConstructComponent implements AfterViewInit, OnChanges {

  constructor(private service: PreviewService) { }
  @Input() sequenceConstruct: SequenceConstruct;
  @Input() inParameters: Map<string, Parameter>
  @Input() showDetail = false;

  public showButton = false;
  public readonly = false;
  public compId = Math.round(Math.random() * 10000);
  public counter = 1;

  // private readonly newParam = (name: string, idx, level) => new Parameter({ name, referencedId: this.trackByIndex(idx, level).toString() })

  private initialized = [String];

  public readonly nextLevel = (level: number) => ++level;

  public readonly getMatIcon = (kind: ElementKind) => getIcon(kind);

  public readonly trackByIndex = (index: number, level: number) => level * 100 + index;

  public readonly isSequence = (element?: any | SequenceConstruct): element is SequenceConstruct =>
    (element) && (element as SequenceConstruct).parameters !== undefined;

  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.sequenceConstruct) && !this.isSequence(this.sequenceConstruct)) {
      console.debug('new SequenceConstruct');
      this.sequenceConstruct = new SequenceConstruct(changes.sequenceConstruct.currentValue);
    } else {
      // console.debug('seems to be fine...');
    }
  }

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, { inDuration: 1000, outDuration: 1000, accordion: false });
  }



  public async onOpenBody(item: ElementRevisionRefImpl<AbstractControlConstruct>, key) {
    try {
      if (!item.element) {
        item = await this.service.getCtrlRevRefAsync(item);
        this.showDetail = false;
      }
      if (!this.initialized.includes(key)) {
        if (getElementKind(item.elementKind) === ElementKind.SEQUENCE_CONSTRUCT) {
          const htmlElement = document.getElementById(key);
          const result = M.Collapsible.init(htmlElement);
          if (result) {
            this.initialized.push(key);
            // console.debug(key);
          } else {
            console.debug('init failed');
          }
        }

      }
    } catch (ex) {
      console.error(ex || JSON);
    }
  }




}
