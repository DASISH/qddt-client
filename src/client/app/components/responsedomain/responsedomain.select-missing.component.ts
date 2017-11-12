import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Category, CategoryService } from '../category/category.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ElementKind, QddtElementType, QddtElementTypes } from '../../shared/preview/preview.service';
import { ResponseDomain } from './responsedomain.service';

@Component({
  selector: 'qddt-responsedomain-select-missing',
  moduleId: module.id,
  providers: [CategoryService],
  styles: [
      `.minHeight {
      min-height: 400px;
      height: auto;
    }`
  ],
  templateUrl: 'responsedomain.select-missing.component.html',
})

export class ResponsedomainSelectMissingComponent implements OnInit {
  @Input() responseDomain: ResponseDomain;
  @Input() modalId: any = 'RSMC-1';
  @Input() readonly: boolean = false;
  @Output() responseDomainSelected = new EventEmitter<any>();
  @Output() responseDomainRemove = new EventEmitter<any>();

  private showbutton: any;
  private missingGroups: Category[];
  private selectedCategoryIndex: number;
  private findMissingAction = new EventEmitter<MaterializeAction>();
  private searchKeysSubject = new Subject<string>();
  private readonly CATEGORY_KIND:QddtElementType = QddtElementTypes[ElementKind.CATEGORY];

  constructor(private service: CategoryService) {
    this.selectedCategoryIndex = 0;
    this.missingGroups = [];
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val.length > 0)
      .subscribe((name: string) => {
        this.service.getAllTemplatesByCategoryKind('MISSING_GROUP', name)
          .subscribe((result: any) => {
          this.missingGroups = result.content;
        });
      });
  }

  ngOnInit() {
    if(!this.readonly) {
      this.readonly = false;
    }
  }
  // ngAfterViewInit() {
  //   this.searchKeysSubject.next('');
  // }
  searchMissingCategories(name: string) {
    this.searchKeysSubject.next(name);
  }

  onRemoveMissingResponsedomain() {
    this.responseDomainRemove.emit(true);
  }

  onAddMissing() {
    this.searchKeysSubject.next('*');
    this.findMissingAction.emit({action:'modal', params:['open']});
  }

  onDismiss() {
    // this.missing = null;
    return false;
  }

  onSave() {
    this.findMissingAction.emit({action:'modal', params:['close']});
    if(this.getMissing()) {
      let object = {
        responseDomain: this.responseDomain,
        responseDomainRevision: 0
      };
      this.responseDomainSelected.emit(object);
    }
  }

  private setMissing(missing: Category) {
    let rd = this.responseDomain;
    if (this.isMixed()) {                           //remove existing missing
      console.log('setMissing isMixed');
      this.deleteChild(rd.managedRepresentation, 'MISSING_GROUP');
    } else
      rd = this.newMixedResponseDomain();

    rd.managedRepresentation.children.push(missing);
    rd.name = rd.managedRepresentation.name = 'Mixed [' + this.getGroupEntities(rd.managedRepresentation)[0].name + '+' + missing.name +']';
    this.responseDomain = rd;
  }

  private getMissing(): Category {
    return this.getGroupEntities(this.responseDomain.managedRepresentation)
      .find(e => e.categoryType === 'MISSING_GROUP');
  }

  private isMixed(): boolean {
    if (this.responseDomain)
      return this.responseDomain.responseKind === 'MIXED';
    return false;
  }

  private deleteChild(representation: Category, categoryType: string) {
    if (!representation.children) {
      return;
    }
    let index = representation.children.findIndex((e: any) => e.categoryType === categoryType);
    if (index >= 0) {
      representation.children.splice(index, 1);
    }
  }

  private getGroupEntities(representation: Category): Category[] {
    if (representation.categoryType !== 'MIXED')
      return [representation];
    else
      return representation.children;
  }


  private newMixedCategory(name: string): any {
    let rep = new Category();
    rep.id = null;
    rep.categoryType = 'MIXED';
    rep.hierarchyLevel = 'GROUP_ENTITY';
    rep.name = rep.description = name;
    return rep;
  }

  private newMixedResponseDomain() {
    let oldResponseDomain = this.responseDomain;
    let rd = new ResponseDomain();
    rd.id = null;
    rd.responseKind = 'MIXED';
    rd.description = 'based on ' + oldResponseDomain.name;
    rd.displayLayout = oldResponseDomain.displayLayout;
    rd.managedRepresentation = this.newMixedCategory('');
    this.getGroupEntities(oldResponseDomain.managedRepresentation).filter(c=>c.categoryType !=='MISSING_GROUP')
      .forEach(c=> rd.managedRepresentation.children.push(c));
    return rd;
  }
}
