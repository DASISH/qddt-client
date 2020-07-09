import { MessageService } from './../../lib/services/message.service';
import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import {
  ActionKind,
  ElementKind,
  getElementKind,
  HierarchyPosition,
  MenuItem,
  PropertyStoreService,
  StringIsNumber, TemplateService,
  UserService
} from '../../lib';
import { isNumber } from 'util';



@Component({
  selector: 'qddt-menu',
  providers: [],
  styleUrls: ['./menu.component.css'],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit, OnDestroy, AfterViewInit {

  public canSee = new Array<boolean>(20);
  public isLoggedIn$: BehaviorSubject<boolean>;
  public username;
  public elementKindRef = ElementKind;
  public isActive: number;

  constructor(private userService: UserService, public property: PropertyStoreService,
    private msgService: MessageService, private router: Router, private service: TemplateService) {

    this.username = this.getUserName();
    this.isLoggedIn$ = userService.loggedIn;
  }

  ngOnInit() {
    this.isLoggedIn$.subscribe(
      (connected) => {
        console.log('Logged In Status [' + connected + ']');
        this.username = this.getUserName();
        this.setVisibility();
        if (connected && this.router.url === '/login') {
          this.router.navigate([this.property.userSetting.url]);
        }
      },
      (error) => console.error(error.toString())
    );
  }

  ngOnDestroy(): void {
    // this.propertyChanged.unsubscribe();
  }


  ngAfterViewInit() {
    document.querySelectorAll('.dropdown-trigger')
      .forEach(menu => M.Dropdown.init(menu, { hover: true, coverTrigger: true }));
  }

  getEmail(): string {
    if (!this.userService.isTokenExpired()) {
      return this.userService.getEmail();
    }
    return '';
  }

  getUserName(): string {
    if (!this.userService.isTokenExpired()) {
      return this.userService.getUsername().charAt(0).toUpperCase() + this.userService.getUsername().slice(1);
    }
    return 'NOT LOGGED IN';
  }

  logoutEvent() {
    this.userService.logout();
  }

  onCheckUrl(event) {
    const parts = event.srcElement.value.toString().split('/');
    if (!this.hasUUID(parts)) { return; } // must be a valid UUID....

    const uuidIdx = this.getUUIDIdx(parts);
    let url;
    if (parts.length - 1 === uuidIdx) {
      url = parts[uuidIdx];
    } else if (parts.length - 2 === uuidIdx) {
      url = parts[uuidIdx] + '/' + parts[uuidIdx + 1];
    }
    event.srcElement.value = '';
    this.gotoUUID(url);
  }

  onSurvey() {
    this.clearSurvey();
    this.router.navigate(['/survey']);
  }

  onStudy() {
    this.clearStudy();
    this.router.navigate(['/study']);
  }

  onTopic() {
    this.clearTopic();
    this.router.navigate(['/topic']);
  }

  onConcept() {
    this.clearConcept();
    this.router.navigate(['/concept']);
  }

  get path(): Array<MenuItem> {
    return this.property.menuPath;
  }

  private clearSurvey() {
    this.clearStudy();
    this.property.pathClear(HierarchyPosition.Survey);
    this.property.set('survey', null);
  }

  private clearStudy() {
    this.clearTopic();
    this.property.pathClear(HierarchyPosition.Study);
    this.property.set('study', null);
  }

  private clearTopic() {
    this.clearConcept();
    this.property.pathClear(HierarchyPosition.Topic);
    this.property.set('topic', null);
  }

  private clearConcept() {
    this.property.pathClear(HierarchyPosition.Concept);
    this.property.set('concept', null);
  }

  private hasAccess(kind: string | ElementKind): boolean {
    return this.userService.canDo(ActionKind.Read, getElementKind(kind));
  }

  private hasUUID(parts): boolean {
    const idx = this.getUUIDIdx(parts);
    return parts.length - 1 === idx ||
      (parts.length - 2 === idx && typeof +parts[parts.length - 1] === 'number');
  }

  private getUUIDIdx(parts: any[]): number {
    return parts.findIndex(pre => pre.length === 36);
  }

  private gotoUUID(uuid: string) {
    this.service.searchByUuid(uuid).then((result) => {
      if (result.revision) {

        this.msgService.sendMessage({
          elementId: result.id,
          elementRevision: result.revision,
          elementKind: result.elementKind
        });
      } else {
        this.router.navigate([result.url]);
      }
    },
      (error) => { throw error; });
  }

  private setVisibility() {
    this.canSee = Object.keys(ElementKind)
      .filter(StringIsNumber)
      .map(key => this.hasAccess(key));
  }
}

