import { Component, Input } from '@angular/core';
import {
  HEADER_DETAILS,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IPageSearch,
  IRevisionRef,
  Page,
  SequenceConstruct, getElementKind
} from '../../classes';
import { InstrumentSequence} from './instrument.classes';
import { TemplateService} from '../../components/template';


@Component({
  selector: 'qddt-instrument-sequence',
  templateUrl: './instrument-sequence.component.html'
})

export class InstrumentSequenceComponent  {
  @Input() sequences: InstrumentSequence[];

  public revisionResults: any[];
  public sequenceList: any[];
  public showProgressBar = false;
  public readonly SEQUENCE = ElementKind.SEQUENCE_CONSTRUCT;
  private pageSearch: IPageSearch = { kind: ElementKind.SEQUENCE_CONSTRUCT, key: '', page: new Page(), sort: 'name,asc' };

  private refMap:  Map<string, string> = new Map();

  constructor(private service: TemplateService) {
  }

  public onItemSearch(ref: IElement) {
    this.showProgressBar = true;
    this.pageSearch.key = ref.element;
    this.service.searchByKind<SequenceConstruct>(this.pageSearch).then(
      (result) => { this.sequenceList = result.content; },
      (error) => { throw error; } );
  }

  public onRevisonSearch(ref: IRevisionRef) {
    this.showProgressBar = true;
    const kind =  getElementKind(ref.elementKind);
    this.service.getRevisionsByKind( kind, ref.elementId).then(
      (result) => { this.revisionResults =
        result.content.sort((e1, e2) => e2.revisionNumber - e1.revisionNumber);
        this.showProgressBar = false;
      } );
  }

  public onRevisionSelect(ref: ElementRevisionRef) {
    const insSeq = new InstrumentSequence();
    insSeq.elementRef = ref;
    ref.element.sequence.forEach( (seq: ElementRevisionRef) => {
      const newSeq = new InstrumentSequence();
      newSeq.elementRef = seq;
      insSeq.sequences.push(newSeq);
    });
    this.sequences.push(insSeq);
  }

  public onDeleteItem(idx) {
    this.sequences.splice(idx, 1);
  }

  public onDismiss() {
    this.revisionResults = null;
    this.sequenceList = null;
  }

  public onOpenBody( sequences: InstrumentSequence[]) {
    sequences.forEach((item) => {
      if (!item.elementRef.element && !this.isSequence(item.elementRef.elementKind)) {
        this.service.getRevisionByKind(
          getElementKind(item.elementRef.elementKind),
          item.elementRef.elementId,
          item.elementRef.elementRevision )
        .then((result) => {
          item.elementRef.element = result.entity;
          // item.elementRef.name = result.entity['questionItem'] ? result.entity['questionItem']['question'] : result.entity.name ;
          item.elementRef.version = result.entity.version;
        });
      }
    });
    // this.onItemSearch({ element: '*', elementKind: this.SEQUENCE });
  }

  public isSequence(kind: ElementKind|string): boolean {
    return getElementKind(kind) === this.SEQUENCE;
  }

  public getIcon(kind: ElementKind|string) {
    const item = Array.from(HEADER_DETAILS.values()).find(e => e.kind === getElementKind(kind));
    return item ? item.icon : 'help';
  }
}
