import {AfterContentChecked, Component, EventEmitter, Input, Output} from '@angular/core';
import {ElementKind, IElement, Page, Study} from '../../../classes';
import {TemplateService} from '../../../components/template';
import {Instrument} from '../../instrument/instrument.classes';

declare var $: any;

@Component({
  selector: 'qddt-study-edit',
  styles: [
    '.nomargin { margin:0; }',
    ':host ::ng-deep .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  providers: [ {provide: 'elementKind', useValue: 'STUDY'}, ],
  template: `
<div *ngIf="isVisible && study"  id="{{formId}}"  >
  <form (ngSubmit)="onSave()" #studyForm="ngForm">

    <div class="row input-field">
      <input name="name" type="text" [(ngModel)]="study.name" required  data-length ="255" materialize="characterCounter">
      <label>Name</label>
    </div>

    <div class="row input-field">
      <textarea name="{{formId}}-description" class="materialize-textarea"  data-length ="10000" materialize="characterCounter"
        [(ngModel)]="study.description" required >
      </textarea>
      <label>Description</label>
    </div>

    <qddt-collection-search-select
      [listItems] = "study.instruments"
      [searchItems]="instrumentsList"
      [labelName]="'Instruments'"
      [elementKind]="INSTRUMENT"
      (selectEvent)="onAddInstrument($event)"
      (searchEvent)="onInstrumentSearch($event)">
    </qddt-collection-search-select>

    <qddt-rational [formName]="'RationalComp'" [element]="study" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer [element]="study" ></qddt-element-footer>

    <div class="row right-align">
      <button type="submit" class="btn btn-default" [disabled]="studyForm.form.invalid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class StudyEditComponent implements  AfterContentChecked {
  @Input() study: Study;
  @Input() readonly = false;
  @Input() isVisible = false;
  @Output() savedEvent =  new EventEmitter<any>();

  public readonly formId = Math.round( Math.random() * 10000);
  public readonly  INSTRUMENT = ElementKind.INSTRUMENT;
  private instrumentsList: Instrument[];

  constructor(private service: TemplateService) { }

  ngAfterContentChecked() {
    $('#' + this.formId + '-desc').trigger('autoresize');
  }

  onSave() {
    this.service.update(this.study).subscribe((result: any) => {
      this.study = null;
      this.savedEvent.emit(result);
    });
  }

  onAddInstrument(item: IElement) {
    this.service.getByKindEntity<Instrument>(this.INSTRUMENT, item.element.id)
      .then( instrument => {
        this.study.instruments.push(instrument);
        // instrument.study = this.study;
        // this.service.update(instrument);
      });
  }

  onInstrumentSearch(key: string) {
    this.service.searchByKind<Instrument>(  {kind: this.INSTRUMENT, key: key, page: new Page() }).then(
      (result) => {
        this.instrumentsList = result.content;
      });
  }
  //
  // onAuthorSelected(author: any) {
  //  this.studyService.attachStudyAuthor(this.study.id, author.id);
  //  this.study['authors'].push(author);
  // }
  //
  // onAuthorRemoved(author: any) {
  //  this.studyService.deattachStudyAuthor(this.study.id, author.id);
  //  const i = this.study['authors'].findIndex((F: any) => F === author);
  //  this.study['authors'].splice(i, 1);
  // }

}
