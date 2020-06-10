import { flatMap, filter } from 'rxjs/operators';
import { Component, Input, AfterViewInit } from '@angular/core';
import { ElementRevisionRef, getElementKind, PreviewService, SequenceConstruct, Parameter, getIcon, ElementKind } from '../../../lib';

@Component({
  selector: 'qddt-preview-sequenceconstruct',

  styles: [
  ],
  template: `
  <div [id]="compId"  *ngIf="sequenceConstruct">
    <span >{{ sequenceConstruct?.description }}</span>
    <ul *ngIf="sequenceConstruct.outParameter">
        <li class="collection-item"><label>Parameters</label></li>
        <li class="collection-item chip" title="Out parameter" *ngFor="let parameter of sequenceConstruct.outParameter">{{getParam(parameter)}} </li>
    </ul>

    <ul id="col{{compId}}" class="collapsible row" data-collapsible="accordion" >
      <li *ngFor="let cqi of sequenceConstruct.sequence">
        <div class="collapsible-header" (click)="onOpenBody(cqi)" >
          <i class="material-icons small teal-text text-lighten-3">{{getMatIcon(cqi.elementKind)}}</i>
          <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=cqi.name></div>
          <qddt-version-label class="col s3 m2 right-align" [revisionRef]="cqi"></qddt-version-label>
        </div>
        <div class=" collapsible-body">
          <div [ngSwitch]="cqi.elementKind">
            <div *ngSwitchCase="'SEQUENCE_CONSTRUCT'">
              <qddt-preview-sequenceconstruct id="pseq{{compId}}" [sequenceConstruct]="cqi.element" [inParameters]="sequenceConstruct?.outParameter"></qddt-preview-sequenceconstruct>
            </div>
            <div *ngSwitchCase="'CONDITION_CONSTRUCT'">
              <qddt-preview-conditionconstruct [condition]="cqi.element"></qddt-preview-conditionconstruct>
            </div>
            <div *ngSwitchCase="'STATEMENT_CONSTRUCT'">
              <qddt-preview-statementconstruct [statement]="cqi.element"></qddt-preview-statementconstruct>
            </div>
            <div *ngSwitchCase="'QUESTION_CONSTRUCT'">
              <qddt-preview-questionconstruct [controlConstruct]="cqi.element" [inParameters]="sequenceConstruct?.outParameter">
              </qddt-preview-questionconstruct>
            </div>
            <div *ngSwitchCase="'INSTRUCTION'">
              <li *ngIf="cqi?.element">
                <p [innerHtml]="cqi?.element['description']"></p>
              </li>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>`,
  providers: [],
})

export class PreviewSequenceConstructComponent implements AfterViewInit {
  @Input() sequenceConstruct: SequenceConstruct;
  @Input() inParameters: Parameter[];
  @Input() showDetail = false;


  public showButton = false;
  public readonly = false;
  public compId = Math.round(Math.random() * 10000);

  constructor(private service: PreviewService) { }

  public ngAfterViewInit(): void {
    const elems = document.getElementById('col' + this.compId);
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

  public getParam(param: Parameter): string {
    if (param.value) {
      return param.name + '🢩' + (param.value || '?');
    } else {
      return param.name + '🢨' + (param.value[0].value || '?');
    }

    if (param.referencedId) {
      return param.name + '🢩' + (param.value || '?');
    } else {
      return param.name + '🢨' + (param.value || '?');
    }
  }
}
