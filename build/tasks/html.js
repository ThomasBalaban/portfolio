// ---- includes

// for running DOM manipulation functions against the html during a gulp process, we use it for the auto-tagger
const dom = require('gulp-jsdom');

// for rendering nunjucks html partials
const nunjucksRender = require('gulp-nunjucks-render');

// for formatting the output of html files
const htmlbeautify = require('gulp-html-beautify');

// for taking the white space out of html output
const minifyHTML = require('gulp-htmlmin');

// for string replacements
const replace = require('gulp-replace');

// for data insertion in templates
const fs = require('fs');
const data = require('gulp-data');

// for removing comments from HTML, JS and CSS - one limitation: mixed media doesn't parse correctly.
// If you have comments in a style or script tag in your html file it will only strip the HTML comments
const strip = require('gulp-strip-comments');

// for injecting the final compiled js and css files into the html file
const inject = require('gulp-inject');


// ---- tasks
module.exports = (requirements, config) => {

  // required modules from index.js
  const gulp = requirements.gulp;
  const browserSync = requirements.browserSync;
  const plumber = requirements.plumber;
  const customPlumber = requirements.customPlumber;

  /*  ===========================================================================

   *  FUNCTION: renderHtmlDev
   *  PURPOSE:  gather nunjucks partials, process <a> tags, <picture> and <img> elements, and render into beautified html
   *  AUTHOR:   Marcus Giannamore
   *  DATE:     02/27/2018

      ========================================================================= */
   gulp.task('renderHtmlDev', () => {
     // Gets .html and .nunjucks files in pages folder
     return gulp.src(`${config.src}/nunjucks/pages/index.nunjucks`)
      .pipe(customPlumber("Error: HTML"))
      // Fill templates with json data
      .pipe(data(() => {
         return JSON.parse(fs.readFileSync(`${config.src}/data/data.json`));
      }))
      // Renders template with nunjucks
      .pipe(nunjucksRender({
        path: [`${config.src}/nunjucks/templates`]
      }))
      .pipe(dom((document) => {
        //pictureElements(document);
        imgClass(document);
        tagging(document);
      }))
      .pipe(replace(/data-em=\"HP_._/g, numberedMatch))
      .pipe(strip())
      // Beautify html file
      .pipe(htmlbeautify({
        indentSize:1
      }))
      // Output rendered files in tmp folder
      .pipe(gulp.dest(config.tmp))
      .pipe(browserSync.stream());
   });

   /*  ===========================================================================

    *  FUNCTION: renderHtmlProd
    *  PURPOSE:  basically renderHtmlDev but without the header/footer - injects contents of tmp/styles.css and tmp/bundle.js into prod.html file - useful only for copying into management center
    *  AUTHOR:   Marcus Giannamore
    *  DATE:     02/27/2018

       ========================================================================= */

    gulp.task('renderHtmlProd', () => {
      return gulp.src(`${config.src}/nunjucks/pages/prod.nunjucks`)
        .pipe(customPlumber("Error: HTML"))
        // Fill templates with json data
        .pipe(data(() => {
           return JSON.parse(fs.readFileSync(`${config.src}/data/data.json`));
        }))
        .pipe(nunjucksRender({
          path: [`${config.src}/nunjucks/templates`]
        }))
        .pipe(dom((document) => {
          //pictureElements(document);
          imgClass(document);
          tagging(document);
        }))
        .pipe(minifyHTML({
            collapseWhitespace: true,
            preserveLineBreaks: true
        }))
        .pipe(replace(/data-em=\"HP_._/g, numberedMatch))
        .pipe(inject(gulp.src([`${config.tmp}/*.css`]), {
          starttag: '<!-- inject:./tmp/styles.css -->',
          relative: true,
          transform: function (filePath, file) {
            return file.contents.toString('utf8');
          }
        }))
        .pipe(inject(gulp.src([`${config.tmp}/*.js`]), {
          starttag: '<!-- inject:./tmp/bundle.js -->',
          relative: true,
          transform: function (filePath, file) {
            return file.contents.toString('utf8');
          }
        }))
        .pipe(strip())
        .pipe(gulp.dest(config.dist));
    });

   /*  ===========================================================================

    *  FUNCTION: tagging
    *  PURPOSE: parse and inject data-em tags onto homepage elements - use as part of a jsdom function
    *  AUTHOR: Brad Steward, originally Layth Abdelquader and Adam Knee
    *  DATE: 02/21/2018

       ========================================================================= */
   function tagging(document) {
     let AnchorElm = document.querySelectorAll('a');
     let curNum = 0;
     for (let a = 0; a < AnchorElm.length; a++) {
       let anchorEl = AnchorElm[a];
       let anchorTitle = anchorEl.title.replace(/[^A-Z0-9]+/gi, '').toLowerCase();
       if (
         anchorEl.getAttribute('data-em') === 'hp_$_' ||
         anchorEl.getAttribute('data-em') === 'HP_$_' ||
         anchorEl.getAttribute('data-em') === 'Hp_$_'
       ) {
         anchorEl.setAttribute('data-em', `hp_${curNum}_${anchorTitle}`);
       } else if (
         anchorEl.getAttribute('data-em') === 'hp_#_' ||
         anchorEl.getAttribute('data-em') === 'HP_#_' ||
         anchorEl.getAttribute('data-em') === 'Hp_#_'
       ) {
         ++curNum;
         anchorEl.setAttribute('data-em', `hp_tms_1485_${curNum}_${anchorTitle}`);
       }
     }
   }

   /*  ===========================================================================

    *  FUNCTION: pictureElements
    *  PURPOSE:  Creates picture elements with srcset attributes
    *  AUTHOR:   ?
    *  DATE:     ?

       ========================================================================= */

   function pictureElements(document) {
     let html_str;
     let elements = document.querySelectorAll('img');
     let config = {
           mobile: 500,
           mobileLand: 740,
           fmt: ['gif', 'alpha-png']
     };

     for (let i = 0; i < elements.length; i++) {
           let imageEl = elements[i];
           let imageSrc = elements[i].src;
           let imageAlt = elements[i].alt;
           let pictureEl = document.createElement('picture');

           if (imageSrc.indexOf('?') > -1) {
                 html_str = `<source media="(max-device-width: 500px)" srcset="${imageSrc}?wid=${config.mobile}">`;
                 html_str += `<source media="(max-device-width: ${config.mobileLand}px) and (orientation: landscape)" srcset="${imageSrc}?wid=${config.mobileLand}">`;
                 html_str += `<img src="${imageSrc}" alt="${imageAlt}" class="img-responsive">`;
           } else {
                 html_str = `<source media="(max-device-width: 500px)" srcset="${imageSrc}?wid=${config.mobile}">`;
                 html_str += `<source media="(max-device-width: ${config.mobileLand}px) and (orientation: landscape)" srcset="${imageSrc}?wid=${config.mobileLand}">`;
                 html_str += `<img src="${imageSrc}" alt="${imageAlt}" class="img-responsive">`;
           }

           pictureEl.innerHTML = html_str;
           imageEl.parentNode.replaceChild(pictureEl, imageEl);
     }
   }

   /*  ===========================================================================

    *  FUNCTION: imgClass
    *  PURPOSE:  adds img-responsive class to <img> elements
    *  AUTHOR:   ?
    *  DATE:     ?

       ========================================================================= */

   function imgClass(document) {
     let elements = document.querySelectorAll('img');
     for (let i = 0; i < elements.length; i++) {
           let imageEl = elements[i];
           if (imageEl.className === '' && imageEl.tagName === 'IMG') {
                 imageEl.className = 'img-responsive';
           }
     }
   }

   /*  ===========================================================================

    *  FUNCTION: numberedMatch
    *  PURPOSE:  ?
    *  AUTHOR:   ?
    *  DATE:     ?

       ========================================================================= */

   function numberedMatch(curTag) {
     let curNum = 0;
     if (curTag === 'data-em="HP_$_') {
           return `data-em="HP_${curNum}_`;
     } else if (curTag === 'data-em="HP_#_') {
           ++curNum;
           return `data-em="HP_${curNum}_`;
     }
   }

};
