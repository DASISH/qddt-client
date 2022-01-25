import { Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ActionKind, delay,
  ElementKind, EventAction,
  getElementKind, getIcon,
  getParameterKind, ParameterKind,
  Factory, ICondition,
  IElement, IRevisionRef, ISelectOption,
  MessageService,
  TemplateService,
  Parameter,
  TreeNodeRevisionRef,
  ElementRevisionRef,
  TreeNodeRevisionRefImpl,
  AbstractControlConstruct,
  ConditionKind,
  IfThenElse, Loop
} from 'src/app/lib';


@Component({
  selector: 'qddt-instrument-treenode',
  styles: [
    'ul.collapsible { padding: 1px; border: 0; margin-top:0; margin-bottom: 0;  }',
    'ul.collapsible  ul.collapsible {  margin-left: 1rem; }',
    '.collapsible-header {padding: 0.75rem; }',
    '.collapsible-header:hover > ul.dropleft { display:block; }',
    'ul.collapsible > li:not(.SEQ) {  counter-increment: item; }',
    'ul.collapsible > li:not(.SEQ):before { content: counters(item, ".") ;  position: absolute; font-size: 0.6rem; }',
  ],
  templateUrl: './instrument-treenode.component.html'
})

export class TreeNodeRevisionRefComponent implements AfterViewInit {
  @Input() treeNodes: TreeNodeRevisionRef[];
  @Input() selectOptions: ISelectOption[];
  @Input() readonly = false;
  @Input() showIcon = true;
  @Input() xmlLang = 'none';
  @Input() inParameters = new Map<string, Parameter>();
  @Output() actionEvent = new EventEmitter<EventAction>();

  public selectedElementKind = 0;
  public SOURCE: IElement | IRevisionRef | null;
  public instance: M.Modal;


  public showLabel = new Map<string, boolean>();

  private action = ActionKind.Create;

  public readonly STATEMENT = ElementKind.STATEMENT_CONSTRUCT

  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly trackById = (item: TreeNodeRevisionRef) => item.id;
  public readonly isSequence = (node: TreeNodeRevisionRef): boolean => getElementKind(node.elementKind) === ElementKind.SEQUENCE_CONSTRUCT;
  public readonly isConditional = (node: TreeNodeRevisionRef): boolean =>
    (node && node.element) ? getElementKind(node.elementKind) === ElementKind.CONDITION_CONSTRUCT : false;
  public readonly isIn = (parameter: Parameter): boolean => getParameterKind(parameter.parameterKind) === ParameterKind.IN;
  public readonly isOut = (parameter: Parameter): boolean => getParameterKind(parameter.parameterKind) === ParameterKind.OUT;

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
            console.debug(cond.conditionKind);
        }
        return cond;
      }
    } catch (ex) {
      // console.debug(ex); just ignore
    }
    return null;
  }


  constructor(private service: TemplateService, public message: MessageService, private router: Router) {
  }


  public ngAfterViewInit(): void {
    this.instance = M.Modal.init(document.getElementById('MODAL-' + this.modalId),
      {
        inDuration: 750, outDuration: 1000, startingTop: '50%', endingTop: '10%', preventScrolling: true,
        onOpenEnd: () => M.updateTextFields(),
        onCloseEnd: () => this.router.navigate([{ outlets: { popup: null } }])
      });
    delay(20).then(() => M.Collapsible.init(document.querySelectorAll('.collapsible')));
  }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.actionEvent.emit({ action: ActionKind.Read, ref: null });
    }
  }

  public onOpenBody(item: TreeNodeRevisionRef) {
    const kind = getElementKind(item.elementKind);
    if (!item.element && (!this.isSequence(item) || item.children.length === 0)) {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));

      console.debug('open body...');
      let cond: ICondition;

      if (kind === ElementKind.CONDITION_CONSTRUCT) {
        cond = this.parseCondition(item.name);
      }
      if (cond) {
        item.element = cond;
        item.name = cond.name;
        this.actionEvent.emit({ action: ActionKind.Read, ref: item });
      } else {
        this.service.getByKindRevision(
          kind,
          item.elementId,
          item.elementRevision)
          .then((result) => {
            if (kind === ElementKind.CONDITION_CONSTRUCT) {
              cond = result as ICondition;
              item.element = {
                id: cond.id,
                name: cond.name,
                classKind: cond.classKind,
                conditionKind: cond.conditionKind,
                condition: cond.condition,
                parameterIn: cond.parameterIn,
                parameterOut: cond.parameterOut
              } as ICondition;
              console.debug(item.element || JSON);
            } else {
              item.element = Factory.createFromSeed(kind, result);
            }
            item.version = result.version;
            item = new TreeNodeRevisionRefImpl<AbstractControlConstruct>(item);
            this.actionEvent.emit({ action: ActionKind.Read, ref: item });
          });
      }
    }
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  // -------------------------------------------------------------------
  public onSelectElementKind(kind) {
    this.selectedElementKind = kind;
    this.SOURCE = { element: '', elementKind: kind };
  }

  public revisionSelectedEvent(ref: ElementRevisionRef) {
    this.actionEvent.emit({ action: this.action, ref: new TreeNodeRevisionRefImpl(ref) });
    this.SOURCE = null;
    this.instance.close();
  }

  public onDismiss(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.SOURCE = null;
    this.instance.close();
  }

  public onCheckParams(id, event) {
    // console.groupCollapsed('onCheckParams');

    // console.debug(id);
    // console.debug(event);
    // console.debug(this.inParameters.get(id).value);
    // console.groupEnd();
    // usefull???
    // this.inParameters.get(id).value = event;

  }


  public onItemNew(event: Event) {
    event.stopPropagation();
    this.action = ActionKind.Create;
    this.instance.open();
  }

  public onDialogConfirm(ref: TreeNodeRevisionRef) {
    if (ref) {
      this.actionEvent.emit({ action: ActionKind.Delete, ref });
    }
  }

  public onItemEdit(event: Event, cqi: TreeNodeRevisionRef) {
    event.stopPropagation();
    this.service.searchByUuid(cqi.elementId).then(
      (result) => { this.router.navigate([result.url]); },
      (error) => { throw error; });
  }

  public onItemUpdate(event: Event, cqi: TreeNodeRevisionRef) {
    event.stopPropagation();
    this.action = ActionKind.Update;
    this.SOURCE = cqi;
    this.instance.open();
  }




}
