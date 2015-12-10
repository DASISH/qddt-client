import {join} from 'path';
import {APP_SRC} from '../config';

export = function buildSassDev(gulp, plugins, option) {
  return function () {
    return gulp.src(join(APP_SRC, '**', '*.scss'))
      .pipe(plugins.sass().on('error', LoginComponent.logError))
      .pipe(gulp.dest(APP_SRC));
  };
}
