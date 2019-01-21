// ---- includes

// for linting js files - with some custom linting options
const jshint = require('gulp-jshint');

// for concatenating 2+ js files together.
const concat = require('gulp-concat');

// for uglifying js, minifying it, and mangling it - options available here save sourceMap: https://github.com/mishoo/UglifyJS2#minify-options
const uglify = require('gulp-uglify');


// ---- tasks
module.exports = (requirements, config) => {

  // required modules from index.js
  const gulp = requirements.gulp;
  const browserSync = requirements.browserSync;
  const plumber = requirements.plumber;
  const customPlumber = requirements.customPlumber;

  /*  ===========================================================================

   *  FUNCTION: js
   *  PURPOSE:  combines multiple js files (if necessary), lints js and puts into tmp directory
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/26/2018

      ========================================================================= */
  gulp.task('js', () => {
      return gulp.src(`${config.src}/js/*.js`)
          .pipe(customPlumber("Error: JS"))
          .pipe(jshint())
          .pipe(jshint.reporter('default'))
          .pipe(jshint.reporter('fail'))
          .pipe(concat('bundle.js'))
          .pipe(uglify())
          .pipe(gulp.dest(config.tmp))
          .pipe(browserSync.stream());
  });
};
