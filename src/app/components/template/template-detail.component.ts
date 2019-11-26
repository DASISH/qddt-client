import {Component, EventEmitter, OnInit, Output, OnDestroy, AfterViewInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { takeWhile } from 'rxjs/operators';
import { IDetailAction, IEntityEditAudit, ActionKind, ElementKind, HEADER_DETAILS, TemplateService, Factory} from '../../lib';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'qddt-template-detail',
  templateUrl: './template-detail.component.html',
})

export class TemplateDetailComponent implements OnInit, OnDestroy, AfterViewInit{
  @Output() closeState = new EventEmitter<IDetailAction>();
  @Output() selectedItem = new EventEmitter<IEntityEditAudit>();


  public item: IEntityEditAudit;
  public revisionIsVisible = false;
  public canDelete: boolean;
  public showProgressBar = true;

  private action: IDetailAction = { id: '', action: ActionKind.None, object: null };
  private kind: ElementKind;
  private alive = true;
  private refreshCount = 0;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute, private location: Location) {
    this.route.url.pipe(
      takeWhile(() => this.alive))
      .subscribe((event) => {
        const path = event[0].path;
        this.kind = HEADER_DETAILS.get(path).kind;
        this.canDelete = service.can(ActionKind.Delete, this.kind );
        // console.log('can delete ' + this.canDelete);
        this.item = Factory.createInstance(this.kind);
      });
  }

  ngOnInit() {
    this.refreshCount = 0;
    if (this.kind) {
      this.showProgressBar = true;
      this.service.getByKindEntity(this.kind, this.route.snapshot.paramMap.get('id')).then(
        (item) => {
            this.action.id = item.id;
            this.item = item;
            this.showProgressBar = false;
            this.selectedItem.emit(item); },
        (error) => { this.showProgressBar = false; throw error; });
    }
  }

  onHideDetail() {
    this.router.navigate(['../' ], { relativeTo: this.route });
    this.closeState.emit(this.action);
  }


  goBack() {
    this.location.back();
    // this.closeState.emit(this.action);
  }

  onDeleteConfirmModal() {
    // this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleting() {
    this.service.delete(this.item)
      .subscribe(() => {
        this.action.action = ActionKind.Delete;
        this.goBack();
      });
  }

  onItemSaved(item: IEntityEditAudit) {
    this.action.action = ActionKind.Update;
    this.action.object = item;
    this.goBack();
  }

  onGetPdf( item: IEntityEditAudit) {
    this.service.getPdf(item).then(
      (data) => { FileSaver.saveAs(data, item.name + '.pdf'); },
      (error) => { throw error; });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  ngAfterViewInit(): void {

    document.querySelectorAll('.fixed-action-btn').forEach(
    input => M.FloatingActionButton.init(input));

    document.querySelectorAll('input[data-length], textarea[data-length]').forEach(
        input => {
          M.CharacterCounter.init(input);
          M.AutoInit(input);
        });
  }

}

