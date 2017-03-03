import { Component, OnInit, EventEmitter } from '@angular/core';
import { PublicationService, Publication, PublicationStatus, PUBLICATIONNOTPUBLISHED } from './publication.service';

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

  private publications: any[];
  private page: any;
  private publication: any;
  private searchKeys: string;
  private selectedPublication: any;
  private isDetail: boolean;
  private columns: any[];
  private demo: any[] = [
    {
      'id': '1',
      'name': 'Plitics',
      'publicationKind': 'Designmeeting 1',
      'purpose': 'Political trust battery',
      'agency' : {
        'id' : '1359dede-9f18-11e5-8994-feff819cdc9f',
        'name' : 'NSD-qddt'
      },
      'version': {
        'major': 1,
        'minor': 0
      },
      'publicationElements': []
    },
    {
      'id': '2',
      'name': 'House work',
      'publicationKind': 'Expert to QVDB',
      'purpose': 'Questions about housework',
      'agency' : {
        'id' : '1359dede-9f18-11e5-8994-feff819cdc9f',
        'name' : 'NSD-qddt'
      },
      'version': {
        'major': 2,
        'minor': 1
      },
      'publicationElements': []
    }
  ];

  constructor(private service: PublicationService) {
    this.isDetail = false;
    this.publications = [];
    this.searchKeys = '';
    this.page = {};
    this.columns = [{ 'label': 'Name', 'name': 'name', 'sortable': true },
    { 'label': 'Purpose', 'name': 'purpose', 'sortable': true },
    { 'label': 'Purpose Status', 'name': 'publicationKind', 'sortable': true }];
  }

  ngOnInit() {
    this.searchPublications('');
  }

  onTogglePublicationForm() {
    this.showPublicationForm = !this.showPublicationForm;
    if (this.showPublicationForm) {
      this.publication = new Publication();
      this.publication.publicationElements = [
        {id: '1', revisionNumber: '2', elementKind: 'questionitem'},
        {id: '2', revisionNumber: '3', elementKind: 'questionitem'},
      ];
      this.publication.publicationKind = PUBLICATIONNOTPUBLISHED.name;
    }
  }

  onDetail(i: any) {
    this.selectedPublication = i;
    this.isDetail = true;
  }

  hideDetail() {
    this.isDetail = false;
  }

  onSelectChange(value: number) {
    if(value >= 10 && value < 20) {
      this.publication.publicationKind = this.selectOptions[0].children[value - 10].name;
    } else if(value >= 20 && value < 30) {
      this.publication.publicationKind = this.selectOptions[1].children[value - 20].name;
    }
  }

  onPage(page: string) {
    //console.log(page);
  }

  onCreatePublication() {
    this.showPublicationForm = false;
    /*TODO disable for demo
       this.service.create(this.publication)
      .subscribe((result: any) => {
        this.publications = [result].concat(this.publications);
      }, (error: any) => {
        this.popupModal(error);
      });*/
    this.isDetail = false;
  }

  searchPublications(key: string) {
    this.service.getAll()
      .subscribe((result: any) => {
        this.publications = result.content || [];
        //for demo
        this.publications = this.demo;
        this.page = result.page;
      }, (error: any) => {
        this.popupModal(error);
      });
  }

  private popupModal(error: any) {
    this.error = error;
    this.actions.emit('openModal');
  }
}
