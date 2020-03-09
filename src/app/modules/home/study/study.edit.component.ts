import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ElementKind, Study, TemplateService, ElementRevisionRef } from '../../../lib';

@Component({
  selector: 'qddt-study-edit',
  providers: [{ provide: 'elementKind', useValue: 'STUDY' }],
  template: `
<div >
  <form *ngIf="isVisible" class="row" id="{{formId}}" (ngSubmit)="onSave()" #ngForm="ngForm">
    <div class="col s12">
      <qddt-input name="name"
        required
        placeholder="Name me"
        label="Name"
        [(ngModel)]="study.name"
        data-length="250">
      </qddt-input>
    </div>
    <div class="col s12">
      <qddt-textarea name="description"
        required
        placeholder="Name me"
        label="Description"
        [(ngModel)]="study.description"
        data-length="10000">
      </qddt-textarea>
    </div>
    <div class="col s12">
      <qddt-element-revision-collection
        [revisionRefs] = "study.instruments"
        [labelName]="'Instruments'"
        [elementKind]="INSTRUMENT"
        (createdEvent) ="onInstrumentAdded($event)"
        (deletedEvent) ="onInstrumentDeleted($event)"
        (modifiedEvent) ="onInstrumentListChanged($event)">
      </qddt-element-revision-collection>
    </div>

    <div class="col s12">
        <qddt-rational  [formName]="'RationalComp'" [element]="study" [config]="{hidden: [2,3]}"></qddt-rational>
    </div>
    <div class="col s12">
        <qddt-element-footer  [element]="study"> </qddt-element-footer>
    </div>
    <div class="col s12 right-align">
      <button type="submit" class="btn btn-default" [disabled]="!ngForm.form.valid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class StudyEditComponent {
  @Input() study: Study;
  @Output() savedEvent = new EventEmitter<Study>();

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly INSTRUMENT = ElementKind.INSTRUMENT;
  public isVisible = false;
  public showRevision = false;    // used by parent form to keep track of revision comp

  constructor(private service: TemplateService) { }

  onSave() {
    this.service.update<Study>(this.study)
      .subscribe((result) => {
        this.study = null;
        this.isVisible = true;
        this.savedEvent.emit(result);
      }
        , (err: any) => {
          this.savedEvent.emit(null);
          throw err;
        });
  }

  onInstrumentAdded(item: ElementRevisionRef) {
    console.log('onInstrumentAdded');
    // this.service.getByKindEntity<Instrument>(this.INSTRUMENT, item.element.id)
    //   .then(instrument => {
    //     this.study.instruments.push(instrument);
    //   });
  }
  onInstrumentDeleted(item: ElementRevisionRef) {
    console.log('onInstrumentDeleted');
    // this.service.getByKindEntity<Instrument>(this.INSTRUMENT, item.element.id)
    // .then(instrument => {
    //   this.study.instruments.push(instrument);
    // });
  }
  onInstrumentListChanged(item: ElementRevisionRef) {
    console.log('onInstrumentListChanged');
    // this.service.getByKindEntity<Instrument>(this.INSTRUMENT, item.element.id)
    // .then(instrument => {
    //   this.study.instruments.push(instrument);
    // });
  }

}
