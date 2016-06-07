import {Component, Input} from 'angular2/core';

import {CategoryService, Category} from '../category.service';
import {MaterializeDirective} from 'angular2-materialize/dist/materialize-directive';
import {Change} from '../../../common/change_status';
import {CategoryType} from '../category_kind';
import {AutocompleteComponent} from '../../autocomplete/autocomplete.component';
@Component({
  selector: 'category-edit',
  moduleId: module.id,
  providers: [CategoryService,CategoryType],
  directives: [AutocompleteComponent, MaterializeDirective],
  template: `
  <div *ngIf="isVisible">
    <div *ngIf="category" class="card" id="{{category.id}}"  >
      <form (ngSubmit)="onSave()" #hf="ngForm">
        <div class="row">
          <div class="input-field col s4">
            <input type="text" [(ngModel)]="category.label" required (ngModelChange)="category.name = category.label.toUpperCase()">
            <label for="label" class="active teal-text">Label</label>
          </div>
          <div class="input-field col s4">
            <label class="active teal-text">Category Kind</label>
            <select [(ngModel)]="category.categoryType" materialize="material_select" required>
              <option value="" disabled selected>Select reason</option>
              <option *ngFor="#change of categoryEnums" [value]="change[0]">{{change[1]}}</option>
            </select>
          </div>
          <div class="input-field col s4">
            <input type="text" [(ngModel)]="category.name" required>
            <label for="name" class="active teal-text">Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <textarea class="materialize-textarea"  [(ngModel)]="category.description" ></textarea>
            <label for="description" class="active teal-text">Description</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6">
            <input id="minimum" type="number"  [(ngModel)]="category.inputLimit.minimum" >
            <div *ngIf="category.categoryType == 'SCALE'" >
              <label for="minimum" class="active teal-text">Scale Begin</label>
            </div>
            <div *ngIf="category.categoryType !== 'SCALE'" >
              <label for="minimum" class="active teal-text">minimum</label>
            </div>
          </div>
          <div class="input-field col s6">
            <input id="maximum" type="number" [(ngModel)]="category.inputLimit.maximum" >
            <div *ngIf="category.categoryType == 'SCALE'" >
              <label for="maximum" class="active teal-text">Scale End</label>
            </div>
            <div *ngIf="category.categoryType !== 'SCALE'" >
              <label for="maximum" class="active teal-text">maximum</label>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s5">
            <label class="active teal-text">Type of Change</label>
            <select [(ngModel)]="category.changeKind"  materialize="material_select" required>
              <option value="" disabled selected>Select reason</option>
              <option *ngFor="#change of changeEnums" [value]="change[0]">{{change[1]}}</option>
            </select>
          </div>
          <div class="input-field col s7">
            <label for="changeComment" class="active teal-text">Reason for change</label>
            <input id="changeComment" type="text" [(ngModel)]="category.changeComment" required>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s8">
            <p><label class="active teal-text">Authors</label></p>
            <div class="chip" *ngFor="#author of category.authors" >
              <img src="{{author.picture}}">{{author.name}} <i class="material-icons">close</i>
            </div>
          </div>
          <div class="input-field col s4">
            <p><label class="active teal-text">Agency</label></p>
            <div class="chip" >{{category.modifiedBy.agency.name}}</div>
          </div>
        </div>
        <div *ngIf="isTemplate" class="row">
           <div class="range-field">
              <input type="range" min="0" max="20" (input)="setCategoryNumber($event)" value="{{category.children.length}}"/>
           </div>
           <div class="row"><table *ngIf="category.children">
             <thead><tr><td>Category</td></tr></thead>
             <tbody>
               <tr *ngFor="#cat of category.children;#idx=index">
                 <td><autocomplete [items]="categories"
                       [searchField]="'label'"
                       (autocompleteFocusEvent)="selectedCategoryIndex=idx;"
                       [initialValue]="cat?.label"
                       (autocompleteSelectEvent)="select($event)"></autocomplete></td>
                </tr>
              </tbody>
            </table></div>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
      </form>
    </div>
  </div>
`
})

export class CategoryEditComponent {

  @Input() category: Category;
  @Input() categories: any;
  @Input() isVisible: boolean;
  private categoryEnums:any;
  private changeEnums: any;
  private isTemplate: boolean;
  private selectedCategoryIndex: number;
  private numberOfCategories: number;

  constructor(private categoryService: CategoryService) {
    this.changeEnums = Change.status;
    this.categoryEnums =  CategoryType.element;
    this.selectedCategoryIndex = 0;
    this.numberOfCategories = 0;
  }

  ngOnInit() {
    this.isTemplate = this.category['hierarchyLevel'] === 'GROUP_ENTITY';
    if(this.isTemplate) {
      this.categoryEnums = CategoryType.group;
    } else {
      this.categoryEnums =  CategoryType.element;
    }
  }

  setCategoryNumber(event:any) {
    this.numberOfCategories = event.target.value;
    if(this.category.children === undefined) {
      this.category.children = [];
    }
    this.category.children = this.category.children.slice(0, this.numberOfCategories);
    for(let i = this.category.children.length; i < this.numberOfCategories; i++) {
        this.category.children.push(new Category());
    }
  }

  select(candidate: any) {
    this.category.children[this.selectedCategoryIndex] = candidate;
  }

  onSave() {
    this.categoryService.edit(this.category)
      .subscribe(result => {
        this.category = result;
        this.isVisible = false;
      });
  }

}
