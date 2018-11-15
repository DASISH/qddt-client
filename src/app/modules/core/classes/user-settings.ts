import {HierarchyPosition} from './hierarchy-position';


export class UserSettings {
  pageSize = 10;
  url = '/home';
  email = 'review@example.org';
  hierarchyPosition = HierarchyPosition.Survey;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  save() {
    localStorage.setItem('USER_SETTINGS', JSON.stringify(this));
  }
}
