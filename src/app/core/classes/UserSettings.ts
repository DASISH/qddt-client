
export enum HIERARCHY_POSITION {
  None,
  Survey,
  Study,
  Topic,
  Concept
}

export class UserSettings {
  pageSize = 10;
  url = '/home';
  email = 'review@example.org';
  hierarchyPosition = HIERARCHY_POSITION.Survey;

  constructor(values: Object = {}) {
    Object.assign(this, values);
  }

  save() {
    localStorage.setItem('USER_SETTINGS', JSON.stringify(this));
  }
}
