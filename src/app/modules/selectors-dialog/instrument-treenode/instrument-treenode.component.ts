import { Router } from '@angular/router';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ActionKind, delay,
  ElementKind, EventAction,
  getElementKind, getIcon,
  Factory,
  IElement, IRevisionRef, ISelectOption,
  MessageService,
  TemplateService,
  Parameter,
  TreeNodeRevisionRef,
  ElementRevisionRef,
  TreeNodeRevisionRefImpl,
  AbstractControlConstruct
} from '../../../lib';


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

  private _showButton = false;
  private action = ActionKind.Create;


  public readonly modalId = Math.round(Math.random() * 10000);
  public readonly trackById = (item: TreeNodeRevisionRef) => item.id;
  public readonly isSequence = (node: TreeNodeRevisionRef): boolean => getElementKind(node.elementKind) === ElementKind.SEQUENCE_CONSTRUCT;

  constructor(private service: TemplateService, public message: MessageService, private router: Router) {
  }


  get showButton(): boolean {
    return this._showButton;
  }
  set showButton(value: boolean) {
    this._showButton = value;
  }

  public ngAfterViewInit(): void {
    this.instance = M.Modal.init(document.getElementById('MODAL-' + this.modalId),
      {
        inDuration: 400, outDuration: 300, startingTop: '4%', endingTop: '25%', preventScrolling: true,
        onOpenEnd: () => M.updateTextFields(),
        onCloseEnd: () => this.router.navigate([{ outlets: { popup: null } }])
      });
    delay(20).then(() => M.Collapsible.init(document.querySelectorAll('.collapsible')));
  }

  public onItemDrop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  public onOpenBody(item: TreeNodeRevisionRef) {
    if (!item.element && (!this.isSequence(item) || item.children.length === 0)) {
      M.Collapsible.init(document.querySelectorAll('.collapsible'));
      const kind = getElementKind(item.elementKind);
      this.service.getByKindRevision(
        kind,
        item.elementId,
        item.elementRevision)
        .then((result) => {
          item.element = Factory.createFromSeed(kind, result.entity);
          item.version = result.entity.version;
          item = new TreeNodeRevisionRefImpl<AbstractControlConstruct>(item);
          this.actionEvent.emit({ action: ActionKind.Read, ref: item });
        });
    }
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }

  // -------------------------------------------------------------------
  public onSelectElementKind(kind) {
    this.SOURCE = { element: '', elementKind: kind };
    // console.log(this.SOURCE);
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
    console.log(id);
    console.log(event);
    // console.log(this.inParameters.get(id).value);
    // this.inParameters.get(id).value = event;
  }


  public onItemNew(event: Event) {
    event.stopPropagation();
    this.action = ActionKind.Create;
    this.instance.open();
  }

  public onDialogConfirm(ref) {
    if (ref) {
      this.actionEvent.emit({ action: ActionKind.Delete, ref });
    }
  }

  public onItemRemove(event: Event, ref: TreeNodeRevisionRef, dialog) {
    event.stopPropagation();
    dialog.open(ref);
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

  // -------------------------------------------------------------------


  // private mergeParameters(construct: AbstractControlConstruct, parameters: Parameter[]) {
  //   //update params from source, delete if no match
  //   // insert no match params in source
  //   console.log('mergeParameters');
  //   construct.parameterOut = parameters.filter(f => (getParameterKind(f.parameterKind) === ParameterKind.OUT));
  //   const paramIn = parameters.filter(f => (getParameterKind(f.parameterKind) === ParameterKind.IN));

  //   construct.parameterIn.forEach(pi => {
  //     let found = paramIn.find(pi2 => pi2.name === pi.name);
  //     if (found) {
  //       pi = found;
  //     } else {
  //       parameters.push(pi);
  //     }
  //   });

  // }



}
