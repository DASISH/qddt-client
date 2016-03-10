import {join} from 'path';
import {argv} from 'yargs';
import {SeedConfig, normalizeDependencies} from './seed.config';

export class ProjectConfig extends SeedConfig {
  PROJECT_TASKS_DIR       = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  API_BASE                = argv['api'] || 'https://qddt.nsd.no/api/';

  constructor() {
    super();
    this.APP_TITLE = 'qddt-client';
    let additional_deps = [
      { src: 'jquery/dist/jquery.min.js', inject: 'libs' },
      { src: 'materialize-css/dist/js/materialize.js', inject: 'libs'},
      { src: 'materialize-css/dist/css/materialize.css',inject: true }
    ];

    this.DEV_NPM_DEPENDENCIES = this.DEV_DEPENDENCIES.concat(normalizeDependencies(additional_deps));
    this.PROD_NPM_DEPENDENCIES = this.PROD_NPM_DEPENDENCIES.concat(normalizeDependencies(additional_deps));

    this.APP_ASSETS = [
      {src: `${this.ASSETS_SRC}/main.css`, inject: true},
    ];

    this.DEV_DEPENDENCIES = this.DEV_NPM_DEPENDENCIES.concat(this.APP_ASSETS);
    this.PROD_DEPENDENCIES = this.PROD_NPM_DEPENDENCIES.concat(this.APP_ASSETS);
  }
}
