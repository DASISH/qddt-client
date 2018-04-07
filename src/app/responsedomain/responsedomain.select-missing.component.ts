import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { Category, CategoryService } from '../category/category.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { ResponseDomain } from './responsedomain.service';
import { QddtElement, QDDT_ELEMENTS, ElementKind } from '../shared/elementinterfaces/elements';
import { Page } from '../shared/table/table.page';

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
  @Input() readonly = false;
  @Output() selectedEvent = new EventEmitter<any>();
  @Output() removeEvent = new EventEmitter<any>();

  public readonly CATEGORY_KIND = QDDT_ELEMENTS[ElementKind.CATEGORY];
  public findMissingAction = new EventEmitter<MaterializeAction>();
  public showbutton: any;
  public missingGroups: Category[];
  public selectedCategoryIndex: number;

  private searchKeysSubject = new Subject<string>();

  constructor(private service: CategoryService) {
    this.selectedCategoryIndex = 0;
    this.missingGroups = [];
    this.searchKeysSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(val => val.length > 0)
      .subscribe((name: string) => {
        this.service.getAllTemplatesByCategoryKind('MISSING_GROUP', name, new Page())
          .then((result: any) => {
          this.missingGroups = result.content;
        });
      });
  }

  ngOnInit() {
    if (!this.readonly) {
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
    this.removeEvent.emit(true);
  }

  onAddMissing() {
    this.searchKeysSubject.next('*');
    this.findMissingAction.emit({action: 'modal', params: ['open']});
  }

  onDismiss() {
    // this.missing = null;
    return false;
  }

  onSave() {
    this.findMissingAction.emit({action: 'modal', params: ['close']});
    if (this.getMissing()) {
      if (this.responseDomain['changeKind']) {
        this.responseDomain['changeKind'] = 'TYPO';
        this.responseDomain['changeComment'] = 'Comment by rule';
        console.log('changeKind set, ready for presisting');
      }
      const object = {
        responseDomain: this.responseDomain,
        responseDomainRevision: 0
      };
      this.selectedEvent.emit(object);
    }
  }

  public setMissing(missing: Category) {
    let rd = this.responseDomain;
    if (this.isMixed()) {                           // remove existing missing
      this.deleteChild(rd.managedRepresentation, 'MISSING_GROUP');
    } else {
      rd = this.newMixedResponseDomain();
    }

    rd.managedRepresentation.children.push(missing);
    rd.name = rd.managedRepresentation.name =
      'Mixed [' + this.getGroupEntities(rd.managedRepresentation)[0].name + '+' + missing.name + ']';
    this.responseDomain = rd;
  }

  public getMissing(): Category {
    return this.getGroupEntities(this.responseDomain.managedRepresentation)
      .find(e => e.categoryType === 'MISSING_GROUP');
  }

  private isMixed(): boolean {
    if (this.responseDomain) {
      return this.responseDomain.responseKind === 'MIXED';
    }
    return false;
  }

  private deleteChild(representation: Category, categoryType: string) {
    if (!representation.children) {
      return;
    }
    const index = representation.children.findIndex((e: any) => e.categoryType === categoryType);
    if (index >= 0) {
      representation.children.splice(index, 1);
    }
  }

  private getGroupEntities(representation: Category): Category[] {
    if (representation.categoryType !== 'MIXED') {
      return [representation];
    } else {
      return representation.children;
    }
  }


  private newMixedCategory(name: string): any {
    const rep = new Category();
    rep.id = null;
    rep.categoryType = 'MIXED';
    rep.hierarchyLevel = 'GROUP_ENTITY';
    rep.name = rep.description = name;
    return rep;
  }

  private newMixedResponseDomain() {
    const oldResponseDomain = this.responseDomain;
    const rd = new ResponseDomain();
    rd.id = null;
    rd.responseKind = 'MIXED';
    rd.description = 'based on ' + oldResponseDomain.name;
    rd.displayLayout = oldResponseDomain.displayLayout;
    rd.managedRepresentation = this.newMixedCategory('');
    this.getGroupEntities(oldResponseDomain.managedRepresentation).filter(c => c.categoryType !== 'MISSING_GROUP')
      .forEach(c => rd.managedRepresentation.children.push(c));
    return rd;
  }
}
