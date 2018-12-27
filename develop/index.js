/* eslint-disable no-console, one-var */

import postcss from 'postcss';
import reporter from 'postcss-reporter';
import { stripIndent } from 'common-tags';
import plugin from '../src';

let from, to;
let input = stripIndent`
  .test {
    scrollbar-width: thin;
  }
`;

postcss()
  .use(plugin)
  .use(reporter)
  .process(input, { from, to })
  .then(result => {
    console.log(result.css);
  })
  .catch(console.error);
