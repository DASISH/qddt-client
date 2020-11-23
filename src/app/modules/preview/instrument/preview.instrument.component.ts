import { Component, Input } from '@angular/core';
import {
  ConditionKind,
  ICondition,
  IfThenElse,
  Instrument, INSTRUMENT_MAP, InstrumentKind,
  Loop,
  Parameter,
  ParameterKind,
  TreeNodeRevisionRef,
  UserResponse,
  getParameterKind,
  TreeNodeRevisionRefImpl,
  AbstractControlConstruct
} from 'src/app/lib/classes';
import { MessageService, PreviewService } from 'src/app/lib/services';
import { getElementKind, getIcon } from 'src/app/lib/consts';
import { ElementKind } from 'src/app/lib/enums';
import { IElement, IRevisionRef } from 'src/app/lib/interfaces';
import { Factory } from 'src/app/lib';


@Component({
  selector: 'qddt-preview-instrument',
  styles: [
    'ul.collapsible { padding: 1px; border: 0; margin-top:0; margin-bottom: 0;  }',
    'ul.collapsible  ul.collapsible {  margin-left: 1rem; }',
    '.collapsible-header {padding: 0.75rem; }',
    '.collapsible-header:hover > ul.dropleft { display:block; }',
    'ul.collapsible > li:not(.SEQ) {  counter-increment: item; }',
    'ul.collapsible > li:not(.SEQ):before { content: counters(item, ".") ;  position: absolute; font-size: 0.6rem; }',
  ],
  template: `
      <li class="collection-item">
        <label>Description</label>
      </li>
      <li class="collection-item">
        <p>{{ instrument?.description }}</p>
      </li>
      <li class="collection-item">
        <label>Instrument type</label>
      </li>
      <li class="collection-item">
        <p>{{ getInstrumentKind(instrument)  }}</p>
      </li>

  <ng-container>
    <ng-container *ngTemplateOutlet="treeNodesImpl; context:{ nodes: instrument.root.children, level:1 }"></ng-container>

    <ng-template #treeNodesImpl let-nodes="nodes" let-level="level">
      <ul [id]="'TREENODE-'+level" *ngIf="nodes" class="collapsible expandable" data-collapsible="expandable">
        <li [id]="node.id" *ngFor="let node of nodes; trackBy:trackById;"
          [ngClass]="{'SEQ': isSequence(node)|| getMatIcon(node.elementKind)==='record_voice_over' }">
          <div class="collapsible-header" [title]="node.id" (click)="onOpenBody(node)">
            <i *ngIf="showIcon"
              class="material-icons small teal-text text-lighten-3">{{getMatIcon(node.elementKind)}}</i>
            <div class="col s9 m10 grey-text text-darken-1" [innerHtml]=node.name></div>
              <qddt-version-label class="col s3 m2 right-align" [revisionRef]="node"></qddt-version-label>
          </div>
          <div class="collapsible-body">
            <ul class="collection with-header hoverable">
              <li class="collection-header" style="cursor: zoom-in;" (click)="showLabel[node.id]=!showLabel[node.id]">
                <label><i class="material-icons small">format_quote</i>Label</label>
              </li>

              <li *ngIf="showLabel[node.id]" class="collection-item">
                <qddt-input required name="name" [(ngModel)]="node.name" data-length="100"></qddt-input>
              </li>
            </ul>
            <ng-container *ngIf="isSequence(node)">
              <qddt-parameter [inParameters]="node.parameters | qddtFilter: isIn " [parameters]="inParameters">
              </qddt-parameter>
            </ng-container>
            <ng-container *ngIf="isConditional(node)">
              <qddt-parameter [inParameters]="node.parameters | qddtFilter: isIn"
                [outParameters]="node.parameters | qddtFilter: isOut" [parameters]="inParameters">
              </qddt-parameter>
            </ng-container>
            <ng-container *ngIf="!isSequence(node) && !isConditional(node)">
              <qddt-preview-controlconstruct [construct]="node.element" [showDetail]="false"
                [inParameters]="inParameters" (selectedEvent)="onCheckParams(node.id, $event)">
              </qddt-preview-controlconstruct>
            </ng-container>
          </div>
          <ng-container *ngTemplateOutlet="treeNodesImpl; context:{ nodes: node.children, level:level+1 }">
          </ng-container>
        </li>
      </ul>
    </ng-template>
  </ng-container>

  <div class="row">
    <qddt-comment-list [ownerId]="instrument.id" [comments]="instrument.comments"></qddt-comment-list>
  </div>
  <div class="row">
    <qddt-element-footer [element]="instrument"></qddt-element-footer>
  </div>`
  ,
})

export class PreviewInstrumentComponent {
  @Input() instrument: Instrument;
  @Input() showIcon = true;
  @Input() inParameters = new Map<string, Parameter>();

  public selectedElementKind = 0;
  public SOURCE: IElement | IRevisionRef | null;
  public instance: M.Modal;

  public showLabel = new Map<string, boolean>();

  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly trackById = (item: TreeNodeRevisionRef) => item.id;
  public readonly isSequence = (node: TreeNodeRevisionRef): boolean => getElementKind(node.elementKind) === ElementKind.SEQUENCE_CONSTRUCT;
  public readonly isConditional = (node: TreeNodeRevisionRef): boolean =>
    (node && node.element) ? getElementKind(node.elementKind) === ElementKind.CONDITION_CONSTRUCT : false;
  public readonly isIn = (parameter: Parameter): boolean => getParameterKind(parameter.parameterKind) === ParameterKind.IN;
  public readonly isOut = (parameter: Parameter): boolean => getParameterKind(parameter.parameterKind) === ParameterKind.OUT;
  public readonly getInstrumentKind = (instrument): string =>
    (instrument) ? INSTRUMENT_MAP.find(p => p.id === InstrumentKind[instrument.instrumentKind]).label : '?';


  private readonly parseCondition = (text: string): ICondition => {
    try {
      const cond = JSON.parse(text) as ICondition;
      if (cond.conditionKind) {
        switch (cond.conditionKind) {
          case ConditionKind.ComputationItem:
            break;
          case ConditionKind.IfThenElse:
            cond.condition = new IfThenElse(JSON.parse(cond.condition));
            break;
          case ConditionKind.Loop:
            cond.condition = new Loop(JSON.parse(cond.condition));
            break;
          default:
            console.log(cond.conditionKind);
        }
        return cond;
      }
    } catch (ex) {
      // console.log(ex); just ignore
    }
    return null;
  }

  constructor(private message: MessageService, private service: PreviewService) { }

  // onViewDetail(element: ElementRevisionRef) {
  //   if (!element.element) {
  //     this.service.getRevisionByKind(element.elementKind, element.elementId, element.elementRevision).then(
  //       (result) => { element.element = result.entity; },
  //       (error) => { throw error; });
  //   }
  // }

  public checkParams(id: string, response: UserResponse[]) {
    console.log(id + ' ' + response[0]);
    this.instrument.parameterOut.get(id).value = response;
  }

  public onOpenBody(item: TreeNodeRevisionRef) {
    const kind = getElementKind(item.elementKind);
    if (!item.element && (!this.isSequence(item) || item.children.length === 0)) {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));

      console.log('open body...');
      let cond: ICondition;

      if (kind === ElementKind.CONDITION_CONSTRUCT) {
        cond = this.parseCondition(item.name);
      }
      if (cond) {
        item.element = cond;
        item.name = cond.name;
        // this.actionEvent.emit({ action: ActionKind.Read, ref: item });
      } else {
        this.service.getRevisionByKind(
          kind,
          item.elementId,
          item.elementRevision)
          .then((result) => {
            if (kind === ElementKind.CONDITION_CONSTRUCT) {
              cond = result.entity as ICondition;
              item.element = {
                id: cond.id,
                name: cond.name,
                classKind: cond.classKind,
                conditionKind: cond.conditionKind,
                condition: cond.condition,
                parameterIn: cond.parameterIn,
                parameterOut: cond.parameterOut
              } as ICondition;
              console.log(item.element || JSON);
            } else {
              item.element = Factory.createFromSeed(kind, result.entity);
            }
            item.version = result.entity.version;
            item = new TreeNodeRevisionRefImpl<AbstractControlConstruct>(item);
            // this.actionEvent.emit({ action: ActionKind.Read, ref: item });
          });
      }
    }
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }
  public onCheckParams(id, event) {
    console.log(id);
  }

}
