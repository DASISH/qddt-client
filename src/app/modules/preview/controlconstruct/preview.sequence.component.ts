import { Component, Input, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import {
  ElementKind, ElementRevisionRefImpl, getElementKind, getIcon,
  IControlConstruct, PreviewService, SequenceConstruct, Parameter
} from '../../../lib';



@Component({
  selector: 'qddt-preview-sequenceconstruct',
  template: `
<div [id]="compId" *ngIf="sequenceConstruct">
  <ul [id]="'UL-' + compId"  class = "collapsible" data-collapsible = "accordion" >
    <ng-container *ngTemplateOutlet="sequenceConstructTmpl; context:{ sequence: sequenceConstruct,  level: 0 }"></ng-container>
  </ul>

  <ng-template #sequenceConstructTmpl let-sequence="sequence" let-level="level">
    <ng-container *ngIf="sequence?.sequence" >
    <li [id]="'LI-' + compId + level + idx"  *ngFor="let cqi of sequence.sequence; let idx = index;" (click)="onOpenBody('LI-' + compId + level + idx, $event, cqi)" >
      <div class="collapsible-header" >
        <i class="material-icons small teal-text text-lighten-3">{{getMatIcon(cqi.elementKind)}}</i>
        <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=cqi.name></div>
        <qddt-version-label [id]="'QV-' + compId + level + idx" class="col s3 m2 right-align" [revisionRef]="cqi"></qddt-version-label>
      </div>
      <div class="collapsible-body">
        <ng-container [ngSwitch]="cqi.elementKind">
          <ng-container *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
            <span>{{ cqi.element?.description }}</span>
            <ul [id]="'UL-' + compId + level+idx " class="collapsible" data-collapsible="accordion" >
              <ng-container *ngTemplateOutlet="sequenceConstructTmpl; context:{ sequence: cqi.element, level: idx }"></ng-container>
            </ul>
          </ng-container>
          <ng-container *ngSwitchCase="'CONDITION_CONSTRUCT'">
              <qddt-preview-conditionconstruct [id]="compId + level + idx" [condition]="cqi.element" [inParameters]="inParameters"></qddt-preview-conditionconstruct>
          </ng-container>
          <ng-container *ngSwitchCase="'STATEMENT_CONSTRUCT'">
            <qddt-preview-statementconstruct [id]="compId + level + idx" [statement]="cqi.element" [inParameters]="inParameters"></qddt-preview-statementconstruct>
          </ng-container>
          <ng-container *ngSwitchCase="'QUESTION_CONSTRUCT'">
            <qddt-preview-questionconstruct [id]="compId + level + idx" [controlConstruct]="cqi.element" [inParameters]="inParameters">
            </qddt-preview-questionconstruct>
          </ng-container>
          <ng-container *ngSwitchCase="'INSTRUCTION'">
            <li *ngIf="cqi?.element">
              <p [innerHtml]="cqi?.element['description']"></p>
            </li>
          </ng-container>
        </ng-container>
      </div>
    </li>
    </ng-container>
  </ng-template>
  </div>`,
})

export class PreviewSequenceConstructComponent implements AfterViewInit, OnChanges {
  @Input() sequenceConstruct: SequenceConstruct;
  @Input() inParameters: Parameter[] = [];
  @Input() showDetail = false;

  public showButton = false;
  public readonly = false;
  public compId = Math.round(Math.random() * 10000);

  private _opened: string[] = [];

  private readonly getRev = (kind: ElementKind, elementId: string, elementRevision: number) =>
    this.service.getRevisionByKind(kind, elementId, elementRevision);

  private readonly getRevRefAsync = async (item: ElementRevisionRefImpl<IControlConstruct>) => {
    if (!item.element) {
      const kind = getElementKind(item.elementKind);
      const result = await this.getRev(kind, item.elementId, item.elementRevision);
      item.element = result.entity;
      item.version = item.element.version;
      if (kind === ElementKind.SEQUENCE_CONSTRUCT) {
        let localSeq = (item.element as SequenceConstruct).sequence;
        const sequencePromises = localSeq
          .map(async (child, _i) =>
            (getElementKind(child.elementKind) === ElementKind.SEQUENCE_CONSTRUCT) ?
              await this.getRevRefAsync(child) :
              await Promise.resolve(child));
        localSeq = await Promise.all(sequencePromises);
        const elems = document.querySelectorAll('.collapsible');
        M.Collapsible.init(elems);
      }
    };
    return await Promise.resolve(item);
  }

  constructor(private service: PreviewService) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.inParameters && changes.inParameters.currentValue && this.sequenceConstruct) {
      this.sequenceConstruct.outParameter =
        [].concat(...this.sequenceConstruct.sequence
          .map(seq => (seq.element) ? seq.element.outParameter : []));
      this.sequenceConstruct.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);
    }
  }

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }

  public async onOpenBody(id: string, event: Event, item: ElementRevisionRefImpl<IControlConstruct>) {
    event.preventDefault();
    if (!this._opened.find(f => f === id)) {
      this._opened = [].concat(...this._opened, [id]);
      item = await this.getRevRefAsync(item);
      this.showDetail = true;
    }
    this.setParameters(item);
  }


  public setParameters(item: ElementRevisionRefImpl<IControlConstruct>) {
    if (this.isSequence(item.element)) {
      item.element.outParameter =
        [].concat(...(item.element as SequenceConstruct).sequence
          .map(seq => (seq.element) ? seq.element.outParameter : []));
    } else {
    }
    console.log(item.name)
    console.log(item.element.outParameter || JSON);
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  public getParam(param: Parameter, divider: string): string {
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

  public isSequence(element: any | SequenceConstruct): element is SequenceConstruct {
    return (element as SequenceConstruct).sequence !== undefined;
  }

}
