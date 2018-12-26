# postcss-scrollbar

[![npm version][npm-image]][npm-url]

/!\ UNDER DEVELOPMENT /!\  
/!\ NOT READY FOR USE /!\

> [PostCSS] plugin enabling custom scrollbars

Aka `CSS Scrollbars`.  
Spec : https://drafts.csswg.org/css-scrollbars-1  
Browser support: https://caniuse.com/#feat=css-scrollbar

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

const input = fs.readFileSync('input.css', 'utf8');

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
.scrollable::-webkit-scrollbar {
  width: 0.5rem;
}
.scrollable {
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
}
.scrollable {
  -ms-overflow-style: -ms-autohiding-scrollbar;
  scrollbar-width: none;
}
```

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
[spec]: https://tabatkins.github.io/specs/css-scrollbar-rule
