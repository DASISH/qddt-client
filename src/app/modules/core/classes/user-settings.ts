import {HierarchyPosition} from './hierarchy-position';


export class UserSettings {
  pageSize = 10;
  url = '/home';
  email = 'review@example.org';
  hierarchyPosition = HierarchyPosition.Survey;

  public constructor(init?: Partial<UserSettings>) {
    Object.assign(this, init);
  }


  save() {
    localStorage.setItem('USER_SETTINGS', JSON.stringify(this));
  }
}
