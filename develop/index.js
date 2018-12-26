/* eslint-disable no-console, one-var */

import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import reporter from 'postcss-reporter';
import plugin from '../src';

let read = name =>
  fs.readFileSync(path.join(process.cwd(), 'test', 'fixture', name), 'utf8');

let input = read('thin/input.css');
let from, to;

postcss()
  .use(plugin)
  .use(reporter)
  .process(input, { from, to })
  .then(result => {
    console.log(result.css);
  })
  .catch(console.error);
