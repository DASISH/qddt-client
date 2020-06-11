import { Component, Input, AfterViewInit } from '@angular/core';
import { ElementRevisionRef, getElementKind, PreviewService, SequenceConstruct, Parameter, getIcon, ElementKind } from '../../../lib';

@Component({
  selector: 'qddt-preview-sequenceconstruct',
  styles: [],
  template: `
<div [id]="compId" *ngIf="sequenceConstruct">
  <span>{{ sequenceConstruct?.description }}</span>
  <ul  id="col{{compId}}-1" *ngIf="sequenceConstruct.outParameter">
      <li class="collection-item"><label>Parameters</label></li>
      <li class="collection-item chip" title="Out parameter" *ngFor="let parameter of sequenceConstruct.outParameter">{{getParam(parameter, '🢨')}} </li>
  </ul>
  <ul id="col{{compId}-2" class="collapsible " data-collapsible="accordion" >
    <ng-container *ngTemplateOutlet="sequenceConstructTmpl; context:{ sequence: sequenceConstruct }"></ng-container>
  </ul>

  <ng-template #sequenceConstructTmpl let-sequence="sequence">
    <li *ngFor="let cqi of sequence.sequence; let idx = index;">
      <div class="collapsible-header" (click)="onOpenBody(cqi)">
        <i class="material-icons small teal-text text-lighten-3">{{getMatIcon(cqi.elementKind)}}</i>
        <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=cqi.name></div>
        <qddt-version-label class="col s3 m2 right-align" [revisionRef]="cqi"></qddt-version-label>
      </div>
      <div class="collapsible-body" ()>
        <ng-container [ngSwitch]="cqi.elementKind">
          <ng-container *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
            <ul id="{{compId}}{{idx}}" class="collapsible" data-collapsible="accordion" >
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

  constructor(private service: PreviewService) { }

  public ngAfterViewInit(): void {
    const elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }

  public onOpenBody(item: ElementRevisionRef) {

    if (!item.element) {
      this.service.getRevisionByKind(
        getElementKind(item.elementKind),
        item.elementId,
        item.elementRevision)
        .then((result) => {
          item.element = result.entity;
          item.version = result.entity.version;
          this.setParameters()
          this.showDetail = true;
        });
    }
  }

  public setParameters() {
    this.sequenceConstruct.outParameter =
      [].concat(...this.sequenceConstruct.sequence.map((seq) => (seq.element) ? seq.element.outParameter : [] as Parameter[]));
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
