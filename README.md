# postcss-scrollbar

[![npm version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]

> [PostCSS] plugin enabling custom scrollbars

Spec : https://drafts.csswg.org/css-scrollbars-1  
Browser support: https://caniuse.com/#feat=css-scrollbar  
Docs: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scrollbars

## Installation

```
npm install postcss-scrollbar --save-dev
```

or

```
yarn add postcss-scrollbar --save-dev
```

## Usage

```js
const fs = require('fs');
const postcss = require('postcss');
const scrollbar = require('postcss-scrollbar');

let input = fs.readFileSync('input.css', 'utf8');

postcss()
  .use(scrollbar)
  .process(input)
  .then(result => {
    fs.writeFileSync('output.css', result.css);
  });
```

## Examples

```css
/* input */
.scrollable {
  scrollbar-color: rebeccapurple green;
  scrollbar-width: thin;
}
```

```css
/* output */
.scrollable::-webkit-scrollbar-thumb {
  background-color: rebeccapurple;
}
.scrollable::-webkit-scrollbar-track {
  background-color: green;
}
.test::-webkit-scrollbar-corner {
  background-color: green;
}
.scrollable::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}
.scrollable {
  -ms-overflow-style: auto;
  scrollbar-color: rebeccapurple green;
  scrollbar-width: thin;
}
```

```css
/* input */
.scrollable {
  scrollbar-width: none;
}
```

```css
/* output */
.scrollable::-webkit-scrollbar {
  width: 0;
  height: 0;
}
.scrollable {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

## options

### `edgeAutohide`

type: `Boolean`  
default: `false`  
Allows for setting the scrollbar behaviour for the Edge Browser.  
`-ms-overflow-style: -ms-autohiding-scrollbar;`  
Edge doesn't support scrollbar styling.  
See https://developer.mozilla.org/fr/docs/Web/CSS/-ms-overflow-style

## Credits

- [Pascal Duez](https://github.com/pascalduez)

## Licence

postcss-scrollbar is [unlicensed](http://unlicense.org/).

[postcss]: https://github.com/postcss/postcss
[npm-url]: https://www.npmjs.org/package/postcss-scrollbar
[npm-image]: http://img.shields.io/npm/v/postcss-scrollbar.svg?style=flat-square
[travis-url]: https://travis-ci.org/pascalduez/postcss-scrollbar?branch=master
[travis-image]: http://img.shields.io/travis/pascalduez/postcss-scrollbar.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/pascalduez/postcss-scrollbar
[codecov-image]: https://img.shields.io/codecov/c/github/pascalduez/postcss-scrollbar.svg?style=flat-square
[depstat-url]: https://david-dm.org/pascalduez/postcss-scrollbar
[depstat-image]: https://david-dm.org/pascalduez/postcss-scrollbar.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/postcss-scrollbar.svg?style=flat-square
[license-url]: UNLICENSE
