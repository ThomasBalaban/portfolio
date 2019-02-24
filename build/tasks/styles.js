// ---- includes

// for interpreting sass into CSS
const sass = require('gulp-sass');

// for doing multiple post-processing operations on css, including autoprefixer. The configuration on this one can get dense, so we may want to limit it a bit more
const postcss = require('gulp-postcss');

// for postcss to process scss just like it does for css. does not compile the sass
const scss = require('postcss-scss');

// for automatically adding all the compatibility prefixes to CSS so we don't have to worry about all that jazz
const autoprefixer = require('autoprefixer');

// for removing unused css
const uncss = require('gulp-uncss');

// for trimming and minifying css
const cleanCSS = require('gulp-clean-css');

// for creating sourcemap upon sass compilation
const sourcemaps = require('gulp-sourcemaps');


// ---- tasks
module.exports = (requirements, config) => {

  // required modules from index.js
  const gulp = requirements.gulp;
  const browserSync = requirements.browserSync;
  const plumber = requirements.plumber;
  const customPlumber = requirements.customPlumber;

  /*  ===========================================================================

   *  FUNCTION: sass-to-css
   *  PURPOSE:  autoprefixes sass and compiles to css, minifies it, writes a sourcemap and outputs to the tmp directory
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/26/2018 *** UPDATED 2/28/2018

      ========================================================================= */
  gulp.task('sass-to-css', () => {
      return gulp.src(`${config.src}/sass/**/*.scss`)
          .pipe(customPlumber('Error: SCSS'))
          .pipe(sourcemaps.init())
          .pipe(sass())
          .pipe(postcss([
            autoprefixer({
              grid: true,
              browsers: 'last 35 versions'
            })
          ], {
            syntax:scss
          }))
          .pipe(cleanCSS({level: {1: {specialComments: 0}}}))
          .pipe(sourcemaps.write('/'))
          .pipe(gulp.dest(config.tmp))
          .pipe(browserSync.stream());
  });

  // Fonts
  gulp.task('fonts', function() {
    return gulp.src([`${config.src}/sass/fonts/**/*.**`])
            .pipe(gulp.dest(`${config.tmp}/fonts/`));
  });


  /*  ===========================================================================

   *  FUNCTION: uncss
   *  PURPOSE:  removes unused css rules
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     03/01/2018

      ========================================================================= */
  gulp.task('uncss', () => {
    return gulp.src(`${config.tmp}/*.css`)
      .pipe(customPlumber('Error: unCSS'))
      .pipe(uncss({
        html: [`${config.tmp}/index.html`]
      }))
      .pipe(gulp.dest(config.tmp));
  });
};
