import { Component, EventEmitter, OnInit, Output, OnDestroy, AfterContentChecked} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterializeAction } from 'angular2-materialize';
import { takeWhile } from 'rxjs/operators';
import { TemplateService } from './template.service';
import { IDetailAction, IEntityEditAudit, ActionKind, ElementKind, HEADER_DETAILS } from '../../classes/index';
import { Factory } from '../../classes/factory';

declare var Materialize: any;
declare var $: any;

const fileSaver = require('file-saver');

@Component({
  selector: 'qddt-template-detail',

  templateUrl: './template-detail.component.html',
})

export class TemplateDetailComponent implements OnInit, OnDestroy, AfterContentChecked {
  @Output() closeState = new EventEmitter<IDetailAction>();
  @Output() selectedItem = new EventEmitter<IEntityEditAudit>();

  public item: IEntityEditAudit;
  public revisionIsVisible = false;
  public canDelete: boolean;
  public deleteAction = new EventEmitter<MaterializeAction>();
  public showProgressBar = true;

  private action: IDetailAction = { id: '', action: ActionKind.None, object: null };
  private kind: ElementKind;
  private alive = true;
  private refreshCount = 0;

  constructor(private service: TemplateService, private router: Router, private route: ActivatedRoute) {
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
    $(document).ready(function() {
      $('.modal').modal({
        ready: () => {
          // Materialize.updateTextFields();
        }
      });
    });
  }

  ngAfterContentChecked(): void {
    if (this.refreshCount < 15) {
      try {
        this.refreshCount++;
        Materialize.updateTextFields();
      } catch (Exception) {
      }
    }
  }

  onHideDetail() {
    this.router.navigate(['../' ], { relativeTo: this.route });
    this.closeState.emit(this.action);
  }

  onDeleteConfirmModal() {
    $('#confirmModal' + this.item.id ).modal('open');
    // this.deleteAction.emit({action: 'modal', params: ['open']});
  }

  onConfirmDeleting() {
    this.service.delete(this.item)
      .subscribe(() => {
        this.action.action = ActionKind.Delete;
        this.onHideDetail();
      });
  }

  onItemSaved(item: IEntityEditAudit) {
    this.action.action = ActionKind.Update;
    this.action.object = item;
    this.onHideDetail();
  }

  onGetPdf( item: IEntityEditAudit) {
    this.service.getPdf(item).then(
      (data) => { fileSaver.saveAs(data, item.name + '.pdf'); },
      (error) => { throw error; });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}

