'use strict';
const gulp = require('gulp');

// for creating a continuous local server that delivers changes to the source in real time
const browserSync = require('browser-sync');

// for chaining together several gulp processes
const runSequence = require('run-sequence');

// for error handling
const plumber = require('gulp-plumber');

// for creating notifications in a gulp task
var notify = require('gulp-notify');

// plumber doesn't emit the 'end' event on errors - this function makes it do that and stops the watcher tasks from breaking on error
const customPlumber = (errTitle) => {
  return plumber({
    errorHandler: notify.onError({
      title: errTitle || "Error Running Gulp",
      message: "Error: <%= error.message %>",
      sound: "Basso"
    })
  });
};

//for passing modules to other task files
const requirements = {
  gulp: gulp,
  browserSync: browserSync,
  plumber: plumber,
  customPlumber: customPlumber
};

//defines project structure for use in tasks
const config = {
  src: 'src',
  tmp: 'tmp',
  dist: 'dist',
  archive: 'archive'
};

// External Task Files
require('./tasks/styles')(requirements, config); // styles
require('./tasks/javascript')(requirements, config); // javascript
require('./tasks/html')(requirements, config); // html
require('./tasks/utilities')(requirements, config); // utilities

module.exports = () => {

   /*  ===========================================================================

    *  FUNCTION: dev
    *  PURPOSE:  starts browsersync, watchers, and compiles files into tmp directory
    *  AUTHOR:   Marcus Giannamore
    *  DATE:     02/27/2018

       ========================================================================= */

  gulp.task('dev', (cb) => {
    runSequence('clean:tmp', 'clean:dist', 'renderHtmlDev', ['sass-to-css', 'js', 'fonts'], ['browserSync', 'watch'], cb);
  });

  /*  ===========================================================================

   *  FUNCTION: prod
   *  PURPOSE:  compiles files into tmp directory, then combines styles, scripts and html for management center into one html file in dist folder
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/27/2018

      ========================================================================= */

 gulp.task('prod', (cb) => {
   runSequence(['clean:tmp', 'clean:dist'], 'renderHtmlDev', ['sass-to-css', 'js'], 'uncss', 'renderHtmlProd', 'clean:tmp', cb);
 });

 /*  ===========================================================================

  *  FUNCTION: archive
  *  PURPOSE:  runs prod task then archives prod file into archive folder
  *  AUTHOR:   Marcus Giannamore
  *  DATE:     03/13/2018

     ========================================================================= */

 gulp.task('archive', (cb) => {
   runSequence('prod', 'saveArchive');
 });

};
