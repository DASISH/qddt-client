import { Component, ViewEncapsulation  } from '@angular/core';
import { UserService } from './core/user/user.service';
import { PropertyStoreService } from './core/global/property.service';

// declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [UserService]
})

export class AppComponent  {

  constructor(private userService: UserService, private  properties: PropertyStoreService) {
    //
  }

  isLoggedIn() : boolean {
    return !this.userService.isTokenExpired();
  }

  onInstruments() {
    this.properties.set('current', 'instrument');
  }

  onSequences() {
    this.properties.set('current', 'sequence');
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
    const current = this.properties.get('current');
    if (current === target) {
      const config = this.properties.get('home');
      if (config.current !== value) {
        this.properties.set(target, {'current': value});
      }
    } else if (this.properties.get(target) === '') {
      this.properties.set(target, {'current': value});
    }
    this.properties.set('current', target);

  }
}
