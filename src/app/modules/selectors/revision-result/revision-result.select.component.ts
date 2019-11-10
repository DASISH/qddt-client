import { Component, OnChanges, EventEmitter, Input, Output, SimpleChanges, AfterViewInit } from '@angular/core';
import { getElementKind, IRevisionRef, IRevisionResultEntity, TemplateService } from '../../../lib';


@Component({
  selector: 'qddt-revision-select',
  templateUrl: './revision-result.select.component.html',
})

export class RevisionResultSelectComponent implements OnChanges, AfterViewInit {
  @Input() revisionRef: IRevisionRef;
  @Output() selectEvent = new EventEmitter<IRevisionResultEntity>();
  @Output() dismissEvent = new EventEmitter<boolean>();

  public revisionResultEntities: IRevisionResultEntity[];
  public selectedRevisionResult: IRevisionResultEntity;
  public showProgressBar = false;
  public showPickRevision = false;
  public selectedRevision;

  constructor(private service: TemplateService) { }

  ngAfterViewInit(): void {
    document.querySelectorAll('select')
      .forEach(select => M.FormSelect.init(select));
  }

  public onClickRevisions(event) {
    this.selectedRevision = +event;
    console.log(event);
    this.selectedRevisionResult = this.revisionResultEntities.find((e: any) => e.revisionNumber === +event);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['revisionRef'] && changes['revisionRef'].currentValue) {
      this.showPickRevision = false;
      const ref = changes['revisionRef'].currentValue as IRevisionRef;
      this.showProgressBar = true;
      this.showPickRevision = true;
      this.service.getByKindRevisions(getElementKind(ref.elementKind), ref.elementId).then(
        (result) => {
          this.revisionResultEntities = result.content.sort((e1: any, e2: any) => e2.revisionNumber - e1.revisionNumber);
          document.querySelectorAll('select')
            .forEach(select => M.FormSelect.init(select));
          this.showProgressBar = false;
          this.onClickRevisions(ref.elementRevision);
        });
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
