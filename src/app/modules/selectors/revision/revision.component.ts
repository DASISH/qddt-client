import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import {
  getElementKind,
  IEntityEditAudit,
  IRevisionRef,
  IRevisionResultEntity,
  ISelectOption,
  SelectItem,
  TemplateService
} from '../../../lib';


@Component({
  selector: 'qddt-revision-select',
  templateUrl: './revision.component.html',
})

export class RevisionComponent implements OnChanges {
  @Input() revisionRef: IRevisionRef;
  @Output() selectEvent = new EventEmitter<IRevisionResultEntity>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public revisionResultEntities: IRevisionResultEntity[];
  public selectedRevisionResult: IRevisionResultEntity;
  public revisionlockups: ISelectOption[];
  public showProgressBar = false;
  public showPickRevision = false;
  // tslint:disable-next-line:variable-name
  private _selectedRevision: number;

  constructor(private service: TemplateService) { }

  get selectedRevision() {
    return this._selectedRevision;
  }
  set selectedRevision(value) {
    this._selectedRevision = +value;
    if (this._selectedRevision <= 1) { return; }
    this.selectedRevisionResult = this.revisionResultEntities.find(entity => entity.revisionNumber === this._selectedRevision);
    // console.log(this._selectedRevision + ' -> ' +  this.selectedRevisionResult || JSON);
  }

  public version(item: IEntityEditAudit) {
    return item.version.major + '.' + item.version.minor + ((item.version.versionLabel) ? ' latest version' : '');
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.revisionRef && changes.revisionRef.currentValue) {

      const ref = changes.revisionRef.currentValue as IRevisionRef;
      this.showProgressBar = true;

      this.service.getByKindRevisions(getElementKind(ref.elementKind), ref.elementId).then(
        (result) => {
          this.revisionResultEntities = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
          this.selectedRevision = ref.elementRevision;
          this.revisionlockups = this.revisionResultEntities.map(rev => new SelectItem({
            id: rev.revisionNumber,
            label: this.version(rev.entity)
          }));
          this.showPickRevision = true;
          this.showProgressBar = false;
        },
        () => this.showProgressBar = false);
    } else {
      // console.log(changes.toString());
    }
  }

  public onSelectRevision() {
    this.selectEvent.emit(this.selectedRevisionResult);
    this.revisionRef = null;
  }

  public onDismiss() {
    this.dismissEvent.emit(true);
    this.revisionRef = null;
  }

}
