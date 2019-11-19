import {  Component, EventEmitter, Input, Output } from '@angular/core';
import { ElementKind, IElement, Instrument, Page, Study, SurveyProgram, TemplateService} from '../../../lib';

@Component({
  selector: 'qddt-study-edit',
  providers: [{ provide: 'elementKind', useValue: 'STUDY' }],
  template: `
<div *ngIf="isVisible">
  <form class="row" id="{{formId}}" (ngSubmit)="onSave()" #ngForm="ngForm">
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
      <qddt-collection-search-select
        [listItems] = "study.instruments"
        [searchItems]="instrumentsList"
        [labelName]="'Instruments'"
        [elementKind]="INSTRUMENT"
        (selectEvent)="onAddInstrument($event)"
        (searchEvent)="onInstrumentSearch($event)">
      </qddt-collection-search-select>
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
  @Input() isVisible = false;
  @Output() savedEvent = new EventEmitter<SurveyProgram>();

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly INSTRUMENT = ElementKind.INSTRUMENT;
  public instrumentsList: Instrument[];
  public showRevision = false;    // used by parent form to keep track of revision comp

  constructor(private service: TemplateService) { }

  onSave() {
    this.service.update<SurveyProgram>(this.study)
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

  onAddInstrument(item: IElement) {
    this.service.getByKindEntity<Instrument>(this.INSTRUMENT, item.element.id)
      .then(instrument => {
        this.study.instruments.push(instrument);
      });
  }

  onInstrumentSearch(key: string) {
    this.service.searchByKind<Instrument>({ kind: this.INSTRUMENT, key, page: new Page() }).then(
      (result) => {
        this.instrumentsList = result.content;
      });
  }

}
