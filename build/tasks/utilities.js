// ---- includes

// for deleting items from the directory - currently used to clean up the dist directory before output
const del = require('del');

// for allowing gulp to accept and work with parameters from the command line
const parameterized = require('gulp-parameterized');

// for renaming files on their way out
const rename = require('gulp-rename');

const prompt = require('gulp-prompt');

// ---- tasks
module.exports = (requirements, config) => {

  // required modules from index.js
  const gulp = requirements.gulp;
  const browserSync = requirements.browserSync;
  const runSequence = requirements.runSequence;

  /*  ===========================================================================

   *  FUNCTION: browserSync
   *  PURPOSE:  sets up a browser sync instance to serve files locally
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/26/2018

      ========================================================================= */
  gulp.task('browserSync', () => {
      browserSync({
          ghostMode: false,
          open: true,
          minify: false,
          server: {
            baseDir: config.tmp
          }
      });
  });

  /*  ===========================================================================

   *  FUNCTION: watch
   *  PURPOSE:  sets up watchers for file changes and recompiles changes into the server directory
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/26/2018

      ========================================================================= */
  gulp.task('watch', () => {
        gulp.watch(`${config.src}/**/*.scss`, ['sass-to-css']);
        gulp.watch(`${config.src}/**/*.js`, ['js']);
        gulp.watch([`${config.src}/**/*.+(html|nunjucks)`, `${config.src}/data/data.json`], ['renderHtmlDev']);
  });

  /*  ===========================================================================

   *  FUNCTION: clean:tmp
   *  PURPOSE:  delete the tmp folder to clear unwanted old code
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/28/2018

      ========================================================================= */
  gulp.task('clean:tmp', () => {
        return del.sync('tmp');
  });

  /*  ===========================================================================

   *  FUNCTION: clean:dist
   *  PURPOSE:  delete the dist folder to clear unwanted old code
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/28/2018

      ========================================================================= */
  gulp.task('clean:dist', () => {
        return del.sync('dist');
  });

  /*  ===========================================================================

   *  FUNCTION: saveArchive
   *  PURPOSE:  copies the prod.html file in dist to the archive folder under a new name given at the command line - used by archive in index.js
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     03/01/2018 -- UPDATED 3/13/2018
   *  NOTES:    see https://github.com/Freyskeyd/gulp-prompt/issues/22

      ========================================================================= */
      gulp.task('saveArchive', () => {
        const prompter = prompt.prompt({
          type: 'input',
          name: 'archiveName',
          message: 'Please enter a name for your archive file:'
        }, (res) => {
          gulp.src(`${config.dist}/prod.html`)
            .pipe(rename(`${res.archiveName}.html`))
            .pipe(gulp.dest(config.archive));
        });

        prompter.write();
      });

};
