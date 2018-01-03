import { Component, ViewEncapsulation, AfterContentChecked, AfterViewInit  } from '@angular/core';
import { UserService } from './auth/user/user.service';
import { AlertComponent} from './alert/alert.component';

declare var $:any;

@Component({
  selector: 'app',
  moduleId: module.id,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [ ]
})

export class AppComponent implements AfterContentChecked ,AfterViewInit{
  public user: any;

  constructor(private userService: UserService) {
    this.user = this.userService.get();
  }

  ngAfterViewInit(){
    $('.button-collapse').sideNav({
      menuWidth: 100, // Default is 300
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
      draggable: true});
    $('.dropdown-button').dropdown();

    $('.collapsible').collapsible();
  }


  ngAfterContentChecked() {
    this.user = this.userService.get();
  }

  logoutEvent() {
    this.userService.remove();
  }

  onInstruments() {
    this.userService.setGlobalObject('current', 'instrument');
  }

  onSequences() {
    this.userService.setGlobalObject('current', 'sequence');
  }

  onQuestions() {
    this.checkRouter('questions', 'list');
  }

  onHome() {
    this.checkRouter('home', 'survey');
  }

  onCategories() {
    this.checkRouter('categories', 'list');
  }

  onSchemes() {
    this.checkRouter('schemes', 'list');
  }

  onResponsedomains() {
    this.checkRouter('responsedomains', 'list');
  }

  onConstructs() {
    this.checkRouter('constructs', 'list');
  }

  onPublications() {
    this.checkRouter('publications', 'list');
  }

  private checkRouter(target: string, value: string) {
    let current = this.userService.getGlobalObject('current');
    if (current === target) {
      let config = this.userService.getGlobalObject('home');
      if(config.current !== value) {
        this.userService.setGlobalObject(target, {'current': value});
      }
    } else if(this.userService.getGlobalObject(target) === '') {
      this.userService.setGlobalObject(target, {'current': value});
    }
    this.userService.setGlobalObject('current', target);
  }
}
