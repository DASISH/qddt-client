import { Component, Input, AfterViewInit } from '@angular/core';
import {
  ElementKind, ElementRevisionRefImpl, getElementKind, getIcon,
  IControlConstruct, PreviewService, SequenceConstruct, Parameter
} from '../../../lib';
import { sequence } from '@angular/animations';
import { identifierModuleUrl } from '@angular/compiler';

@Component({
  selector: 'qddt-preview-sequenceconstruct',
  styles: [],
  template: `
<div [id]="compId" *ngIf="sequenceConstruct">
  <ul id="col{{compId}-2" class="collapsible" data-collapsible="accordion" >
    <ng-container *ngTemplateOutlet="sequenceConstructTmpl; context:{ sequence: sequenceConstruct }"></ng-container>
  </ul>

  <ng-template #sequenceConstructTmpl let-sequence="sequence">
    <ng-container *ngIf="sequence?.sequence" >
    <li id="LI-{{compId}}{{idx}}"  *ngFor="let cqi of sequence.sequence; let idx = index;">
      <div class="collapsible-header" (click)="onOpenBody(cqi)">
        <i class="material-icons small teal-text text-lighten-3">{{getMatIcon(cqi.elementKind)}}</i>
        <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=cqi.name></div>
        <qddt-version-label id="QV-{{compId}}{{idx}}" class="col s3 m2 right-align" [revisionRef]="cqi"></qddt-version-label>
      </div>
      <div class="collapsible-body">
        <ng-container [ngSwitch]="cqi.elementKind">
          <ng-container *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
            <span>{{ cqi.element?.description }}</span>
            <ul *ngIf="cqi.element?.outParameter">
                <li><label>Parameters</label></li>
                <li class="chip" title="Out parameter" *ngFor="let parameter of cqi.element.outParameter">{{getParam(parameter, '🢨')}} </li>
            </ul>
            <ul id="UL-{{compId}}{{idx}}" class="collapsible" data-collapsible="accordion" >
              <ng-container *ngTemplateOutlet="sequenceConstructTmpl; context:{ sequence: cqi.element }"></ng-container>
            </ul>
          </ng-container>
          <ng-container *ngSwitchCase="'CONDITION_CONSTRUCT'">
              <qddt-preview-conditionconstruct id="{{compId}}{{idx}}" [condition]="cqi.element" [inParameters]="sequence?.outParameter"></qddt-preview-conditionconstruct>
          </ng-container>
          <ng-container *ngSwitchCase="'STATEMENT_CONSTRUCT'">
            <qddt-preview-statementconstruct id="{{compId}}{{idx}}" [statement]="cqi.element" [inParameters]="sequence?.outParameter"></qddt-preview-statementconstruct>
          </ng-container>
          <ng-container *ngSwitchCase="'QUESTION_CONSTRUCT'">
            <qddt-preview-questionconstruct id="{{compId}}{{idx}}" [controlConstruct]="cqi.element" [inParameters]="sequence?.outParameter">
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
  providers: [],
})

export class PreviewSequenceConstructComponent implements AfterViewInit {
  @Input() sequenceConstruct: SequenceConstruct;
  @Input() inParameters: Parameter[] = [];
  @Input() showDetail = false;

  public showButton = false;
  public readonly = false;
  public compId = Math.round(Math.random() * 10000);


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

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }

  public async onOpenBody(item: ElementRevisionRefImpl<IControlConstruct>) {
    console.log('onOpenBody');
    item = await this.getRevRefAsync(item);
    this.setParameters(item);
    this.showDetail = true;
  }


  public setParameters(item: ElementRevisionRefImpl<IControlConstruct>) {
    if (item.element.sequence) {
      item.element.outParameter =
        [].concat(...item.element.sequence.map((seq) => (seq.element) ? seq.element.outParameter : [] as Parameter[]));
      console.log('outp count: ' + item.element.outParameter.length);
    }
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  public getParam(param: Parameter, divider: string): string {
    if (this.inParameters) {
      this.sequenceConstruct.inParameter =
        this.sequenceConstruct.inParameter.map(obj => this.inParameters.find(o => o.name === obj.name) || obj);
    }
    return param.name + divider + ((param.value) ? param.value.map(p => '[' + p.value + ':' + p.label + ']').join(',') : '?');
  }

}
