import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
  ActionKind,
  CONSTRUCT_MAP,
  IElement,
  Instrument,
  INSTRUMENT_MAP,
  InstrumentKind,
  IRevisionRef,
  LANGUAGE_MAP,
  TemplateService,
  SequenceConstruct,
  SEQUENCE_TYPES,
  TreeNodeRevisionRef, hasChanges, replaceNode, getElementKind, ElementKind, ICondition
} from '../../lib';

@Component({
  selector: 'qddt-instrument-form',
  templateUrl: './instrument.form.component.html',
})

export class InstrumentFormComponent implements OnChanges {
  @Output() modifiedEvent = new EventEmitter<Instrument>();
  @Input() readonly = false;
  @Input() instrument: Instrument;

  public formId = Math.round(Math.random() * 10000);
  public selectId = 0;
  public currentInstrumentType = InstrumentKind.QUESTIONNAIRE;
  public SOURCE: IElement | IRevisionRef | null;
  public readonly CONSTRUCT = SEQUENCE_TYPES;

  public readonly instrumentMap = INSTRUMENT_MAP;
  public readonly languageMap = LANGUAGE_MAP;
  public readonly constructMap = CONSTRUCT_MAP;


  constructor(private service: TemplateService) {
  }


  public getDescription(value: string): string {
    return this.instrumentMap.find(pre => pre.value === value).description;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (hasChanges(changes.instrument)) {
      this.instrument = new Instrument(JSON.parse(JSON.stringify(changes.instrument.currentValue)));
      console.debug(this.instrument.parameterOut || JSON);
      this.instrument.root = this.postloadTreeNode(this.instrument.root);
      this.currentInstrumentType = InstrumentKind[this.instrument.instrumentKind];
      this.service.canDoAction(ActionKind.Update, this.instrument)
        .then(can => this.readonly = !can);
    }
  }

  public onUpdateInstrument() {
    this.instrument.root = this.prePersistTreeNode(this.instrument.root);
    this.service.update<Instrument>(this.instrument).subscribe(
      (result) => {
        this.instrument = result;
        this.modifiedEvent.emit(result);
      },
      (error) => { throw error; });
  }


  public onSelectOption(value) {
    this.SOURCE = { element: '', elementKind: value };
    console.debug(this.SOURCE);
  }

  public onDoAction(response: { action: ActionKind; ref: TreeNodeRevisionRef }) {
    const action = response.action as ActionKind;
    const ref = response.ref as TreeNodeRevisionRef;
    switch (action) {
      case ActionKind.Read:
        this.instrument.initParameters();
        this.instrument.root.children.forEach(c => console.debug(c.name));
        // console.debug(replaceNode(this.instrument.root.children, ref));
        break;
      case ActionKind.Create: this.onItemAdded(ref); break;
      case ActionKind.Update: this.onItemModified(ref); break;
      case ActionKind.Delete: this.onItemRemoved(ref); break;
      default: {
        console.error('wrong action recieved ' + ActionKind[action]);
      }
    }
    // this.instrument.initParameters();
  }

  public onItemRemoved(ref: TreeNodeRevisionRef) {
    const tmp = this.instrument.root.children.filter(f => !(f.id === ref.id));
    this.instrument.root.children = null;
    this.instrument.root.children = tmp;
  }

  public onItemAdded(ref: TreeNodeRevisionRef) {
    this.instrument.root.children.push(ref);
  }

  public onItemModified(ref: TreeNodeRevisionRef) {
    const idx = this.instrument.root.children.findIndex(f => f.elementId === ref.elementId);
    const seqNew: TreeNodeRevisionRef[] = [].concat(
      this.instrument.root.children.slice(0, idx),
      ref,
      this.instrument.root.children.slice(idx + 1)
    );
    this.instrument.root.children = seqNew;
  }



  public isSequence(entity?: any | SequenceConstruct): entity is SequenceConstruct {
    return (entity) && (entity as SequenceConstruct).sequence !== undefined;
  }


  private prePersistTreeNode(node: TreeNodeRevisionRef): TreeNodeRevisionRef {
    if (getElementKind(node.elementKind) === ElementKind.CONDITION_CONSTRUCT && node.element) {
      const con = node.element as ICondition;
      node.name = JSON.stringify({
        id: con.id,
        name: node.name,
        conditionKind: con.conditionKind,
        classKind: con.classKind,
        condition: con.condition,
        parameterIn: con.parameterIn,
        parameterOut: con.parameterOut
      } as ICondition)
    }
    node.element = null;
    node.children = node.children.map(tn => this.prePersistTreeNode(tn));
    return node;
  }


  private postloadTreeNode(node: TreeNodeRevisionRef): TreeNodeRevisionRef {
    if (getElementKind(node.elementKind) === ElementKind.CONDITION_CONSTRUCT) {
      if (!node.element) {
        try {
          const cc = JSON.parse(node.name) as ICondition;
          if (cc.conditionKind) {
            node.element = cc;
            node.name = cc.name;
            node.parameters = [].concat(...cc.parameterIn, ...cc.parameterOut);
          }
        } catch (ex) {

        }
      } else {
        node.element.name = node.name;
      }
    }
    node.children = node.children.map(tn => this.postloadTreeNode(tn));
    return node;
  }

}

