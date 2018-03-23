import { Component, OnInit, EventEmitter, AfterContentChecked } from '@angular/core';
import { PublicationService, Publication, PublicationStatus, PublicationElement } from './publication.service';
import { Subject } from 'rxjs/Subject';
import { MaterializeAction } from 'angular2-materialize';
import { Column } from '../shared/table/table.service';
import { QddtElement, QddtElements } from '../preview/preview.service';
import { PropertyStoreService } from '../core/global/property.service';

@Component({
  selector: 'qddt-publication',
  moduleId: module.id,
  templateUrl: './publication.component.html'
})
export class PublicationComponent implements AfterContentChecked, OnInit {

  public showAddElement = false;
  public showProgressBar = false;
  public showPublicationForm = false;
  public isDetail = false;

  public selectedElementDetail: PublicationElement;
  public selectedElementType: QddtElement;
  public selectedPublicationStatusOption: String;
  public selectedPublication: Publication;

  public publications: Publication[];
  private publication: Publication;
  private page = {};
  private searchKeys: string;
  private searchKeysSubect: Subject<string> = new Subject<string>();

  private readonly columns: Column[] = [{ 'label': 'Name', 'name': 'name', 'sortable': true,  'direction': ''  },
  { 'label': 'Purpose', 'name': 'purpose', 'sortable': true,  'direction': '' },
  { 'label': 'Publication Status', 'name': 'status', 'sortable': true,  'direction': ''  },
  { 'label': 'Modified', 'name': 'modified', 'sortable': true, 'direction': 'desc' }];


  constructor(private service: PublicationService, private property: PropertyStoreService) {
    this.searchKeys = '';

    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.showProgressBar = true;
        this.service.searchPublications(name, '0', this.getSort()).then(
          (result: any) => {
            this.publications = result.content || [];
            this.page = result.page;
            this.showProgressBar = false; },
          (error: any) => {
            this.showProgressBar = false;
            throw error; });
      });
  }

  ngOnInit() {
    const config = this.property.get('publications');
    this.showProgressBar = true;
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.publications = config.collection;
      this.selectedPublication = config.item;
      this.isDetail = true;
    } else {
      this.searchKeys = config.key;
      this.searchKeysSubect.next(this.searchKeys);
    }
  }

  ngAfterContentChecked() {
    const config = this.property.get('publications');
    if (config.current === 'detail' ) {
      this.page = config.page;
      this.publications = config.collection;
      this.selectedPublication = config.item;
      this.searchKeys = config.key;
      this.isDetail = true;
    } else {
      this.isDetail = false;
      if (config.key === null || config.key === undefined) {
        this.property.set('publications', {'current': 'list', 'key': ''});
        this.searchKeys = '';
        this.searchKeysSubect.next('');
      }
    }
  }

  onTogglePublicationForm() {
    this.showPublicationForm = !this.showPublicationForm;
    if (this.showPublicationForm) {
      this.publication = new Publication();
      this.publication.status = this.service.getStatusByName('NOTPUBLISHED').label;
    }
  }

  onDetail(i: any) {
    this.selectedPublication = i;
    this.isDetail = true;
    this.property.set('publications',
      {'current': 'detail',
        'page': this.page,
        'key': this.searchKeys,
        'item': this.selectedPublication,
        'collection': this.publications});
  }

  addElement(e: PublicationElement) {
    this.publication.publicationElements.push(e);
  }

  hideDetail() {
    this.isDetail = false;
    this.property.set('publications', {'current': 'list', 'key': this.searchKeys});
  }

  onSelectChange(value: number) {
    const ps =  this.service.getStatusById(value);
    this.publication.status = ps.label;
    this.selectedPublicationStatusOption = ps.description;
  }

  onPage(page: string) {
    this.showProgressBar = true;
    this.service.searchPublications(this.searchKeys, page, this.getSort()).then(
      (result: any) => {
        this.publications = result.content || [];
        this.page = result.page;
        this.showProgressBar = false; },
      (error: any) => {
        this.showProgressBar = false;
        this.hideDetail();
        throw error; });
  }


  onCreatePublication() {
    this.showPublicationForm = false;
    this.service.create(this.publication).subscribe(
      (result) => { this.publications.push(result); },
      (error) => { throw error; } );
      this.hideDetail();
    }

  searchPublications(key: string) {
    this.searchKeys = key;
    this.searchKeysSubect.next(key);
  }


  private getSort() {
    const i = this.columns.findIndex((e: any) => e.sortable && e.direction !== undefined && e.direction !== '');
    let sort = '';
    if (i >= 0) {
      if (typeof this.columns[i].name === 'string') {
        sort = this.columns[i].name + ',' + this.columns[i].direction;
      } else {
        sort = this.columns[i].name.join('.') + ',' + this.columns[i].direction;
      }
    }
    return sort;
  }

}
