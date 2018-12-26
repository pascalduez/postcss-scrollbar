import fs from 'fs';
import path from 'path';
import postcss from 'postcss';
import plugin from '../src';

const pluginName = require('../package.json').name;

const read = name =>
  fs.readFileSync(path.join(__dirname, 'fixture', name), 'utf8');

const input = read('thin/input.css');

describe('control: ', () => {
  test('no options', () =>
    postcss([plugin])
      .process(input)
      .then(result => {
        expect(result.css).toMatchSnapshot();
      }));

  test('with options', () =>
    postcss([plugin({})])
      .process(input)
      .then(result => {
        expect(result.css).toMatchSnapshot();
      }));

  test('PostCSS legacy API', () => {
    const result = postcss([plugin.postcss]).process(input).css;
    expect(result).toMatchSnapshot();
  });

  test('PostCSS API', async () => {
    const processor = postcss();
    processor.use(plugin);

    const result = await processor.process(input);

    expect(result.css).toMatchSnapshot();
    expect(processor.plugins[0].postcssPlugin).toBe(pluginName);
    expect(processor.plugins[0].postcssVersion).toBeTruthy();
  });
});
