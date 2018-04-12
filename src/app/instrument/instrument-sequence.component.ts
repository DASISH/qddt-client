import { Component,  OnChanges, SimpleChanges, Input } from '@angular/core';
import { TemplateService } from '../template/template.service';
import { InstrumentSequence } from './instrument.classes';
import { SequenceConstruct } from '../controlconstruct/controlconstruct.classes';
import { QDDT_QUERY_INFOES } from '../shared/classes/constants';
import { ElementKind } from '../shared/classes/enums';
import { ElementRevisionRef } from '../shared/classes/classes';


@Component({
  selector: 'qddt-instrument-sequence',
  moduleId: module.id,
  templateUrl: './instrument-sequence.component.html'
})

export class InstrumentSequenceComponent implements OnChanges {
  @Input() sequence: InstrumentSequence[];

  public selectedElement: InstrumentSequence;
  public suggestions: SequenceConstruct[];
  public revisions: any[];
  public readonly SEQUENCE = QDDT_QUERY_INFOES[ElementKind.SEQUENCE_CONSTRUCT];

  constructor(private service: TemplateService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.sequence);
  }

  public onOpenBody(sequence: InstrumentSequence[]) {
    sequence.forEach((item) => {
      if (!item.elementRef.element) {
        this.service.getRevisionByKind(
          this.getElementKind(item.elementRef.elementKind),
          item.elementRef.elementId,
          item.elementRef.elementRevision )
        .then((result) => {
          item.elementRef.element = result.entity;
          item.elementRef.name = result.entity.name;
          item.elementRef.version = result.entity.version;
        });
      }
    });
    this.onSearchElements('*');
  }

  public onSearchElements(search: string) {
    this.service.searchByKind(ElementKind.SEQUENCE_CONSTRUCT, search).then(
      (result) => {
        console.log(result);
        this.suggestions = result.content; },
      (error) => { throw error; } );
  }


  public onSelectElement(ref ) {
    const kind =  this.service.getElementKind(ref.classKind);
    this.service.getRevisionsByKind(kind, ref.id).then(
      (result) => {
        console.log('revisions');
        this.revisions = result.content;
      },
      ( error ) => {} );
  }
  public onRevisionDismiss(value: Boolean) {
    this.revisions = null;
    this.suggestions = null;
  }

  public onRevisionSelected(ref: ElementRevisionRef) {
    const insSeq = new InstrumentSequence();
    insSeq.elementRef = ref;
    this.sequence.push(insSeq);
  }

  public getElementKind(kind: string|ElementKind): ElementKind {
    return (typeof kind === 'string') ?  ElementKind[kind] : kind ;
  }


}
