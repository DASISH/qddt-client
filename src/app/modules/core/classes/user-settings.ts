import {HierarchyPosition} from './hierarchy-position';


export class UserSettings {
  pageSize = 10;
  url = '/home';
  email = 'review@example.org';
  hierarchyPosition = HierarchyPosition.Survey;
  xmlLang = '';

  public constructor(init?: Partial<UserSettings>) {
    Object.assign(this, init );
  }

/*  private load() {
     return JSON.parse(localStorage.getItem('USER_SETTINGS'))
  } */

  save() {
    localStorage.setItem('USER_SETTINGS', JSON.stringify(this));
  }
}
