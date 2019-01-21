# DSG Homepage

---

* [Installation](#installation)
* [Gulp Tasks](#gulp-tasks)
* [Data Structures](#data-structures)
    * [Configuration](#configuration)
    * [Main Data Block](#main-data-block)
        * [Element Types](#element-types)
* [Sass and BEM](#sass-and-bem)
    * [SASS Folder Structure Run Down](#sass-folder-structure-run-down)
    * [BEM Quick Run Down](#bem-quick-run-down)
        * [BEM - Blocks](#bem---blocks)
        * [BEM - Elements](#bem---elements)

## Installation

```sh
// clone repo
$ git clone {{repo name}}
// pull build process submodule
$ cd build_hp
$ git submodule update --init --recursive
$ cd ..
// install dependencies from build process submodule
$ npm i
```

---

## How to use

### Gulp Tasks

* __gulp dev__ - main dev task
* __gulp prod__
    * Compiles SCSS, JS and Nunjucks partials into one html file (dist/prod.html)
    * CSS for MC is in the top `<style>` block
    * HTML for MC is inside the `<body>`
    * JS for MC is inside the `<script>` tag at the bottom
* __gulp archive__ - runs gulp prod and archives the prod file for reference
    * This task prompts you for an archive name. Please use the MC activity name for the homepage you are archiving

### Data Structures

The homepage data.json is divided into two categories:

* [Configuration](#configuration)
* [Main Data Block](#main-data-block)

The Configuration section handles all of the homepage elements that are constants or specialized. Among these are included SW Promos, flash sale, and Fan Shop promos, among others. These all appear above the first piece of content in the Main Data Block. Use this section for things that require some unique configuration.

The Main Data Block is a list of objects, each one representing a "row" in the HP layout. A row doesn't have to be full width, but they are set as such by default. I'll get into the specifics of sizing later.

#### Configuration

* `wrapperClass` - String that determines the classes appended to the `#hp-wrapper` element that contains all the HP code.
* `debug` - Boolean - set to true to see overlays that tell you which items in the config or main data blocks are which on the page, as well as which feature blocks are which and some additional data there as well.
* `flashSale` - Contains all data necessary for building the Flash Sale HP Element
* `flashSaleTest` - Temporary(maybe...) - Element that is used for a richer Flash Sale Experience on HP
* `hotMarket` - Used for either creating a placeholder, or building the Hot market content on the HP
* `shoeLaunch` - Used for building Shoe Launches, which sometimes have a timed element associated with them.
* `fanShop` - Used for building Live Text Fan Shop promo header
* `SWPromo` - For the various functions and configurations related to building a Site Wide Promo banner

#### Main Data Block

Named `data` in the data.json file, this object is a collection of objects that represent the various rows. It builds the page in the order that these objects are organized, so the first one in the list will be the first item built. Each item has a few common datapoints:

* `type` - string - Can be anyone of these types (to be described in detail below)
    * `feature` - A collection of [Feature Blocks](#feature-block)
    * `banner` - Large image with 0 to n links.
    * modal - Incomplete
    * `testZone` - an empty div for creating empty placeholders within the code
    * `placeholder` - Can be used to create an empty div, or fill with a rendered HTML string
    * `header` - A complex element, previously used for the p1, has since fallen into disuse. Probably would need some work to get going again.
    * `script` - used for injecting a script tag into the HP - Use only for very temporary script placements.
    * `text-banner` - similarly disused, usually if I have to put text under an image I'll use the well-established `feature` type and maybe just have the one feature block contained within.
* `size` - [Object](#size-object) - used for determining column width on page. Defaults to whatever value is set on `globals.maxColumnWidth`, which is at 12 by default.
* `classes` - string, list of classes that apply to the row element, space separated
* `header` - [Object](#header-object) - Used to render a subheading above a row, has options for various configurations

#### Data Types

##### Feature Block

```json
{
  "link": "string - optional - relative url, unless circumstances demand otherwise",
  "classes": "string - optional - space separated list of classes for this particular feature block",
  "image": {
    "gif": "boolean - set to true to allow gif image to be animated, changes scene7 url that renders",
    "src": "string - required - name of Scene7 image",
    "srcMobile": "string - optional - included if the image changes on mobile"
  },
  "size": {
    "mobile": "string - optional - number of columns that this element takes up within the container on mobile, set to globals.maxColumnWidth by default",
    "desktop": "string - optional - number of columns that this element takes up on desktop, defaults to mobile size when unset"
    },
  "textClasses": "string - list of classes to apply to the block that holds all the text - See [Helper Classes] for some examples",
  /****************************************
   mobileText: Array of objects, each one becomes a line of text. Can have any number, but the standard design of the page allows for 2, or 3 if circumstances truly demand it
  *****************************************/
  "mobileText": [
    {
      "classes": "string - optional - list of classes to apply to this particular line of text",
      "copy": "string - required - text that needs to be in that line on the feature block. You can put any html elements or entities in here and it will render fine. All the copy values for each element in the array are appended to each other to build into the alt and title tags on the element",
      "link": "string - optional - use only if they require a link on each one of the elements individually (usually for disclaimer details)"
    }
  ]
}
```

##### Size Object

```json
"size": {
  "mobile": "string - optional - number value of the number of columns to consume on mobile - set to globals.maxColumnWidth by default",
  "desktop": "string - optional - set to mobile value by default"
}
```

##### Header Object

```json
"header": {
  "id": "string - optional - elementId of the Header element",
  "classes": "string - optional - list of classes to add to the header element, space separated",
  "value": {
    "top": "string - optional - lesser text in the header arrangement",
    "main": "string - greater text in the header arrangement"
  },
  "inline": "boolean - optional - if true, the header macro will render inside of the Row, allowing you to set it within a background that might be used on the row."
}
```

### SASS and BEM

The homepage utilizies a combination of sass and bem as the base architecture methodology for readble and modularlized css.

#### SASS Folder Structure Run Down

* sass/bootstrap3 - Contains the Bootstrap 3 library in sass form.
* sass/_core.scss - Base styling goes in here, resets should also go in here.
* sass/_helpers.scss - Any helper classes should go in here.
* sass/_mixins.scss - All sass mixins should good in this file.
* sass/_vars.scss - All variables should go into this file.
* sass/_tmp.scss - Due to the constant changing nature of the homepages, we decided to create this file so you can put any non-resuable/week specific styling in here.  This file should ideally be cleared whenever you start a new homepage.  All styles in this file should be written in the *BEM Architecture*.  __If you notice that you are reusing any styles in this file, please make it clean it up and place it in styles.scss.__
* sass/_manifest.scss - The manifest file is responsible for pulling in all of the sass partials and making them avaiable to sass/styles.scss.
* sass/styles.scss - The final file is styles.scss.  This is file contains global/reusable stylings written in the *BEM Architecture*. __THIS FILE SHOULD REMAIN CLEAN AND NOT CONTAIN NON-REUSABLE STYLES.__

#### BEM Quick Run Down

BEM is a modular/easy-to-read css architecture methodology.   BEM stands for "Block Element Modifier".

What does Block, Element and Modifier mean?

* Block - A block is standalone entity that only is affected by itself and does not belong to another entity.
* Element - An Element is a child of a block and is tied semantically to it.
* Modifier - A modifier can be used to modify either the block itself or the blocks elements. 

The main goal of using BEM is make the css code base reusable and easy to understand/comeback to when the developers get swicthed around with the cbu rotation.

QA/DEV should periodically check if the BEM naming convention is being followed properly, and if not it should be corrected before the codebase becomes unmanagable again.

Please look at the following url for a more detailed [explaination](http://getbem.com/introduction/)

[Detailed explatation of the naming convention](http://getbem.com/naming/)

##### BEM - Blocks

The block would be the base css class.

SASS Example:

```sass
//The block will be a class
.block {
}
```

HTML Example:

```html
<div class="block">

</div>  
```

##### BEM - Elements

Elements are signified by double underscores: `__`

SASS Example:

```sass
.block {
    &__element {

    }
}
```

The sass example will produce the following classes:

```css
.block {}
.block__element {}
```

HTML Example:

```html
<div class="block">
    <h1 class="block__element"></h1>
</div>
```

##### BEM - Modifiers

Modifiers are signified by double dashes: `--`

SASS Example:

```sass
.block {
    &__element {
        &--modifier {}
    }
    &--modifier {

    }
}
```

The sass example will produce the following classes:

```css
.block {}
.block--modifier {}
.block__element {}
.block__element--modifier {}
```

__THOUGH SASS FLATTENS THE CSS OUTPUT, YOU SHOULD NOT USE ELEMENT MODIFIERS TO MODIFY IT'S BLOCK AND VICE-VERSA.__

HTML Example:

```html

<div class="block block--modifier">
    <h1 class="block__element"></h1>
    <h1 class="block__element block__element--modifier"></h1>
</div>

```

---