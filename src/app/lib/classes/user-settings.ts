import { HierarchyPosition } from '../enums';

export class UserSettings {
  pageSize = 10;
  url = '/home';
  email = 'review@example.org';
  hierarchyPosition = HierarchyPosition.Survey;
  xmlLang = '';

  public constructor(init?: Partial<UserSettings>) {
    Object.assign(this, init);
  }

  save() {
    localStorage.setItem('USER_SETTINGS', JSON.stringify(this));
  }
}
