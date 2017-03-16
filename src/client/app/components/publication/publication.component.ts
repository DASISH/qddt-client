import { Component, OnInit, EventEmitter } from '@angular/core';
import { PublicationService, DEMO, Publication, PublicationStatus, PUBLICATIONNOTPUBLISHED, ElementTypes } from './publication.service';
import { Subject }          from 'rxjs/Subject';

@Component({
  selector: 'qddt-publication',
  moduleId: module.id,
  templateUrl: './publication.component.html',
  styles: [
    `.noItemFound {
        border: thick solid red;
    }`
  ],
  providers: [PublicationService],
})
export class PublicationComponent implements OnInit {

  showPublicationForm: boolean = false;
  actions = new EventEmitter<string>();
  error: any;
  selectOptions: any[] = PublicationStatus;
  showAddElement: boolean;

  publications: any[];
  private page: any;
  private selectedElementDetail: any;
  private selectedElementType: number;
  private selectedPublicationStatusOption: any;
  private publication: any;
  private searchKeys: string;
  private selectedPublication: any;
  private isDetail: boolean;
  private columns: any[];
  private searchKeysSubect: Subject<string> = new Subject<string>();

  constructor(private service: PublicationService) {
    this.isDetail = false;
    this.publications = [];
    this.searchKeys = '';
    this.page = {};
    this.selectedPublicationStatusOption = PUBLICATIONNOTPUBLISHED.description;
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Purpose', 'name': 'purpose', 'sortable': true },
    { 'label': 'Purpose Status', 'name': 'status', 'sortable': true }];
    this.searchKeysSubect
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((name: string) => {
        this.service.searchPublications(name)
          .subscribe((result: any) => {
            this.publications = result.content || [];
            this.page = result.page;
          }, (error: any) => {
            this.publications = [DEMO];
            console.log(error);
          });
      });
  }

  ngOnInit() {
    this.searchKeysSubect.next('');
  }

  onTogglePublicationForm() {
    this.showPublicationForm = !this.showPublicationForm;
    if (this.showPublicationForm) {
      this.publication = new Publication();
      this.publication.publicationElements = [ ];
      this.publication.status = PUBLICATIONNOTPUBLISHED.label;
    }
  }

  onDetail(i: any) {
    this.selectedPublication = i;
    this.isDetail = true;
  }

  onElementDetail(e: any) {
    this.selectedElementDetail = e.element;
    let type = ElementTypes.find(el => el.type === e.elementKind);
    if(type !== undefined) {
      this.selectedElementType = type.id;
      this.actions.emit('openModal');
    }
  }

  addElement(e: any) {
    this.publication.publicationElements.push(e);
  }

  hideDetail() {
    this.isDetail = false;
  }

  onSelectChange(value: number) {
    this.selectedPublicationStatusOption = PUBLICATIONNOTPUBLISHED.description;
    if(value >= 10 && value < 20) {
      this.publication.status = this.selectOptions[0].children[value - 10].label;
      this.selectedPublicationStatusOption = this.selectOptions[0].children[value - 10].description;
    } else if(value >= 20 && value < 30) {
      this.publication.status = this.selectOptions[1].children[value - 20].label;
      this.selectedPublicationStatusOption = this.selectOptions[1].children[value - 20].description;
    }
  }

  onPage(page: string) {
    this.service.searchPublications(this.searchKeys, page)
      .subscribe((result: any) => {
        this.publications = result.content || [];
        this.page = result.page;
      }, (error: any) => {
        console.log(error);
      });
  }

  onCreatePublication() {
    this.showPublicationForm = false;
    this.publication['changeKind'] = 'CREATED';
    this.service.create(this.publication)
      .subscribe((result: any) => {
        this.publications = [result].concat(this.publications);
      }, (error: any) => {
        console.log(error);
      });
    this.isDetail = false;
  }

  searchPublications(key: string) {
    this.searchKeys = key;
    this.searchKeysSubect.next(key);
  }

}
