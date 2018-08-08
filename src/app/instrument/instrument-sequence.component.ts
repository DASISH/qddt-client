import { Component,  OnChanges, SimpleChanges, Input } from '@angular/core';
import { TemplateService } from '../template/template.service';
import { InstrumentSequence } from './instrument.classes';
import { SequenceConstruct } from '../controlconstruct/controlconstruct.classes';
import { ElementKind } from '../shared/classes/enums';
import {ElementRevisionRef, Page} from '../shared/classes/classes';
import {IElement, IPageSearch, IRevisionRef} from '../shared/classes/interfaces';


@Component({
  selector: 'qddt-instrument-sequence',
  moduleId: module.id,
  templateUrl: './instrument-sequence.component.html'
})

export class InstrumentSequenceComponent  {
  @Input() sequence: InstrumentSequence[];

  public revisionResults: any[];
  public sequenceList: any[];
  public showProgressBar = false;
  public readonly SEQUENCE = ElementKind.SEQUENCE_CONSTRUCT;
  private pageSearch: IPageSearch = { kind: ElementKind.SEQUENCE_CONSTRUCT, key: '*', page: new Page(), sort: 'name,asc' };

  constructor(private service: TemplateService) { }

  public onItemSearch(ref: IElement) {
    this.showProgressBar = true;
    this.pageSearch.key = ref.element;
    this.service.searchByKind<SequenceConstruct>(this.pageSearch).then(
      (result) => { this.sequenceList = result.content; },
      (error) => { throw error; } );
  }

  public onRevisonSearch(ref: IRevisionRef) {
    this.showProgressBar = true;
    const kind =  this.service.getElementKind(ref.elementKind);
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
    this.sequence.push(insSeq);
  }

  public onDeleteItem(idx) {
    this.sequence = this.sequence.splice(idx, 1);
  }

  public onDismiss() {
    this.revisionResults = null;
    this.sequenceList = null;
  }

  public onOpenBody(sequence: InstrumentSequence[]) {
    sequence.forEach((item) => {
      if (!item.elementRef.element) {
        this.service.getRevisionByKind(
          this.service.getElementKind(item.elementRef.elementKind),
          item.elementRef.elementId,
          item.elementRef.elementRevision )
        .then((result) => {
          item.elementRef.element = result.entity;
          item.elementRef.name = result.entity.name;
          item.elementRef.version = result.entity.version;
        });
      }
    });
    this.onItemSearch({ element: '*', elementKind: this.SEQUENCE });
  }

  public isSequence(kind: ElementKind|string): boolean {
    return this.service.getElementKind(kind) === this.SEQUENCE;
  }

}
