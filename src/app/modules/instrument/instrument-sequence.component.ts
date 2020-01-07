import { Component, Input, AfterViewInit } from '@angular/core';
import {
  HEADER_DETAILS,
  ElementKind,
  ElementRevisionRef,
  IElement,
  IPageSearch,
  IRevisionRef,
  Page,
  SequenceConstruct, getElementKind, InstrumentSequence, getIcon, TemplateService
} from '../../lib';



@Component({
  selector: 'qddt-instrument-sequence',
  templateUrl: './instrument-sequence.component.html'
})

export class InstrumentSequenceComponent implements AfterViewInit {
  @Input() sequence: InstrumentSequence[];

  public showProgressBar = false;
  public readonly SEQUENCE = ElementKind.SEQUENCE_CONSTRUCT;
  // private refMap: Map<string, string> = new Map();

  constructor(private service: TemplateService) {
  }

  ngAfterViewInit(): void {
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems);
  }


  public onRevisionSelect(ref: ElementRevisionRef) {
    const insSeq = new InstrumentSequence();
    insSeq.elementRef = ref;
    ref.element.sequence.forEach((seq: ElementRevisionRef) => {
      const newSeq = new InstrumentSequence();
      newSeq.elementRef = seq;
      insSeq.sequence.push(newSeq);
    });
    console.log(insSeq || JSON);
    this.sequence.push(insSeq);
  }

  public onDeleteItem(idx) {
    this.sequence.splice(idx, 1);
  }

  public onDismiss() {
    console.log('dissmiss');
  }

  public onOpenBody(sequence: InstrumentSequence[]) {
    sequence.forEach((item) => {
      if (!item.elementRef.element && !this.isSequence(item.elementRef.elementKind)) {
        this.service.getByKindRevision(
          getElementKind(item.elementRef.elementKind),
          item.elementRef.elementId,
          item.elementRef.elementRevision)
          .then((result) => {
            item.elementRef.element = result.entity;
            item.elementRef.version = result.entity.version;
          });
      }
    });

  }

  public isSequence(kind: ElementKind | string): boolean {
    return getElementKind(kind) === this.SEQUENCE;
  }

  public getMatIcon(kind: ElementKind): string {
    return getIcon(kind);
  }


}
