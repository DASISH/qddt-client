import { AfterContentChecked, AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { ElementKind, IElement, Instrument, Page, Study, TemplateService } from '../../../lib';

@Component({
  selector: 'qddt-study-edit',
  styles: [
    // '.nomargin { margin:0; }',
    // ':host ::ng-deep .hoverable .row { min-height:3rem; margin-bottom:0px;}'
  ],
  providers: [{ provide: 'elementKind', useValue: 'STUDY' }],
  template: `
<div [hidden]="!(isVisible && study)">
  <form class="row" id="{{formId}}" (ngSubmit)="onSave()" #studyForm="ngForm">
    <div class="col s12 input-field">
      <input name="name" type="text" [(ngModel)]="study.name" required  data-length ="255" >
      <label>Name</label>
    </div>

    <div class="col s12 input-field">
      <textarea name="description" class="materialize-textarea"  data-length ="10000"
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

    <qddt-rational class="col s12" [formName]="'RationalComp'" [element]="study" [config]="{hidden: [2,3]}"></qddt-rational>

    <qddt-element-footer class="col s12" [element]="study" ></qddt-element-footer>

    <div class="col s12 right-align">
      <button type="submit" class="btn btn-default" [disabled]="studyForm.form.invalid" >Submit</button>
    </div>
  </form>
</div>
`
})

export class StudyEditComponent implements AfterContentChecked, AfterViewInit {
  @Input() study: Study;
  @Input() readonly = false;
  @Input() isVisible = false;
  @Output() savedEvent = new EventEmitter<any>();

  public readonly formId = Math.round(Math.random() * 10000);
  public readonly INSTRUMENT = ElementKind.INSTRUMENT;
  public instrumentsList: Instrument[];

  constructor(private service: TemplateService) { }

  ngAfterContentChecked(): void {
    document.querySelectorAll('textarea').forEach(
      input => M.textareaAutoResize(input));
  }

  ngAfterViewInit(): void {
    document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
      input => M.CharacterCounter.init(input));
  }


  onSave() {
    this.service.update(this.study).subscribe((result: any) => {
      this.study = null;
      this.savedEvent.emit(result);
    });
  }

  onAddInstrument(item: IElement) {
    this.service.getByKindEntity<Instrument>(this.INSTRUMENT, item.element.id)
      .then(instrument => {
        this.study.instruments.push(instrument);
        // instrument.study = this.study;
        // this.service.update(instrument);
      });
  }

  onInstrumentSearch(key: string) {
    this.service.searchByKind<Instrument>({ kind: this.INSTRUMENT, key, page: new Page() }).then(
      (result) => {
        this.instrumentsList = result.content;
      });
  }

}
