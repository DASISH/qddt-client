import { ElementKind } from '../enums';
import { Page } from '../classes';


export interface IPageResult<T> {
  content: T[];
  links: [{ href: string, rel: string }];
  page: Page;
}


export interface IPageSearch {
  kind: ElementKind;
  key: string;
  xmlLang: string;
  hasDetailSearch?: boolean;
  keys?: Map<string, string>;
  page?: Page;
  sort?: string;
}


export interface IHeaderDetail {
  icon: string;
  headerName: string;
  kind: ElementKind;
}
