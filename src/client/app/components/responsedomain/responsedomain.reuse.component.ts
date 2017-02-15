import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { DomainType, DomainTypeDescription } from './responsedomain.constant';
import { ResponseDomainService } from './responsedomain.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'responsedomain-reuse',
  moduleId: module.id,
  template: `
    <div *ngIf="isVisible" class="row">
      <div class="row">
        <div>
          <h4>Reuse Domain</h4>
        </div>
        <div class="response-domain-title">
			    <span name="text">Domain Type:</span>
			  </div>
			  <div class="col left" *ngFor="let domain of domainTypeDescription">
				  <input name="domaintypegroup" type="radio" id="rdomain-type-{{domain.id}}"
          (click)="selectDomainType(domain.id)" [checked]="domainType === domain.id"
				  />
          <label [attr.for]="'rdomain-type-' + domain.id">{{domain.label}}</label>
			  </div>
      </div>
      <div *ngIf="showAutocomplete">
        <autocomplete [items]="responseDomains" class="black-text"
          [searchField]="'name'"
          (autocompleteFocusEvent)="selectedIndex=idx;"
          [initialValue]="''"
          [searchFromServer]="true"
					(enterEvent)="searchResponseDomains($event)"
          (autocompleteSelectEvent)="select($event)">
        </autocomplete>
      </div>
      <div class="row" *ngIf="selectedResponseDomain">
        <qddt-responsedomain-select
          [responseDomain]="selectedResponseDomain"
          [revision]="selectedRevision"
          (useResponseDomainEvent)="onUseResponseDomainEvent($event)">
        </qddt-responsedomain-select>
      </div>
      <responsedomain-form *ngIf="responseDomain"
        (formChange)="formChange()" [responsedomain]="responseDomain" [domainType]="domainType">
      </responsedomain-form>
    </div>`,
  styles: [],
  providers: [ResponseDomainService],
})

export class ResponsedomainReuseComponent implements OnInit, OnChanges {
  @Input() isVisible: boolean;
  @Input() responseDomain: any;
  @Output() responseDomainReuse: EventEmitter<any> = new EventEmitter();
  selectedResponseDomain: any;
  selectedRevision: number;
  public domainTypeDef = DomainType;
  public domainTypeDescription: any[];
  private domainType: DomainType;
  private showAutocomplete: boolean;
  private responseDomains: any;
  private selectedIndex: number;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private responseDomainService: ResponseDomainService) {
    this.showAutocomplete = false;
    this.domainType = DomainType.SCALE;
    this.responseDomains = [];
    this.domainTypeDescription = DomainTypeDescription.filter((e:any) => e.id !== DomainType.MIXED);
    this.selectedIndex = 0;
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        let domainType = DomainTypeDescription.find((e: any) => e.id === this.domainType).name;
        this.responseDomainService
          .getAll(domainType, name).subscribe((result: any) => {
            this.responseDomains = result.content;
          });
      });
    this.reuse();
  }

  ngOnInit() {
    this.searchKeysSubect.next('');
  }

  ngOnChanges() {
    if (this.responseDomain !== undefined && this.responseDomain !== null) {
      let description = this.domainTypeDescription.find((e: any) => e.name === this.responseDomain.responseKind);
      if (description !== undefined) {
        this.domainType = description.id;
      }
    } else {
      this.domainType = DomainType.SCALE;
    }
  }

  formChange() {
    if (this.responseDomain.id !== undefined && this.responseDomain.id !== '') {
      this.responseDomainService.update(this.responseDomain).subscribe((result: any) => {
        this.responseDomain = result;
        let object = {
          responseDomain: this.responseDomain
        };
        this.responseDomainReuse.emit(object);
      });
    } else {
      this.responseDomainService.create(this.responseDomain).subscribe((result: any) => {
        this.responseDomain = result;
        this.responseDomains.push(this.responseDomain);
        let object = {
          responseDomain: this.responseDomain
        };
        this.responseDomainReuse.emit(object);
      });
    }
    this.isVisible = false;
  }

  selectDomainType(id: DomainType) {
    this.domainType = id;
    this.selectedResponseDomain = null;
    this.reuse();
    this.responseDomain = null;
  }

  reuse() {
    this.responseDomainService.getAll(DomainTypeDescription.find((e: any) =>
      e.id === this.domainType).name).subscribe((result: any) => {
      this.responseDomains = result.content;
      this.showAutocomplete = true;
    });
  }

  select(responseDomain: any) {
    this.selectedResponseDomain = responseDomain;
    this.selectedRevision = 0;
  }

  onUseResponseDomainEvent(item) {
    this.responseDomainReuse.emit(item);
    this.isVisible = false;
  }

  searchResponseDomains(key: string) {
    this.searchKeysSubect.next(key);
  }
}
