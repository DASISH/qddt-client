import { join } from 'path';
import { argv } from 'yargs';
import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';
/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
  API_BASE          = argv['api'] || 'https://qddt.nsd.no/api/';

  constructor() {
    super();
    this.APP_TITLE = 'QDDT - Questionnaire Design and Documentation Tool';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      { src: 'jquery/dist/jquery.min.js', inject: 'libs' },
      { src: 'hammerjs/hammer.min.js', inject: 'libs'},
      // { src: 'charenc/charenc.js', inject: 'libs'},
      // { src: 'crypt/crypt.js', inject: 'libs'},
      // { src: 'is-buffer/index.js', inject: 'libs'},
      // { src: 'md5/md5.js', inject: 'libs'},
      { src: 'file-saver/FileSaver.js', inject: 'libs'},
      { src: 'materialize-css/dist/js/materialize.js', inject: 'libs'},
      { src: 'materialize-css/dist/css/materialize.css',inject: true }
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      ...this.APP_ASSETS,
      // {src: `${this.ASSETS_SRC}/main.css`, inject: true},
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
    ];

    /* Add to or override NPM module configurations: */
    // this.mergeObject(this.PLUGIN_CONFIGS['browser-sync'], { ghostMode: false });
    // Add packages (e.g. ng2-translate)
    const additionalPackages: ExtendPackages[] = [
      {
        name: '@angular/common/http',
        path: 'node_modules/@angular/common',
        packageMeta: {
          main: 'bundles/common-http.umd.js',
          defaultExtension: 'js'
        }
      },
      {
        name: 'angular2-materialize',
        packageMeta: {
          main: 'index',
          defaultExtension: 'js'
        }
      },
      {
        name: 'tslib',
        path: 'node_modules/tslib',
        packageMeta: {
          main: 'tslib.js',
          defaultExtension: 'js'
        }
      },
      // {
      //   name: 'ng2-gravatar-directive',
      //   path: 'node_modules/ng2-gravatar-directive',
      //   packageMeta: {
      //     main: 'src/index',
      //     defaultExtension: 'js'
      //   }
      // },
      {
        name: 'file-saver',
        path: 'node_modules/file-saver',
        packageMeta: {
          main: 'FileSaver',
          defaultExtension: 'js'
        }
      }
    ];
    //
    this.addPackagesBundles(additionalPackages);

  }

}
