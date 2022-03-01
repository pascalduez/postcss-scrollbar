import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import { name } from '../package.json';
import plugin from '../src';

let from, to;
let input = stripIndent`
  .test {
    scrollbar-width: thin;
  }
`;

describe('control:', () => {
  test('no options', () =>
    postcss()
      .use(plugin)
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      }));

  test('with options', () =>
    postcss()
      .use(plugin({}))
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      }));

  test('PostCSS API', async () => {
    let processor = postcss();
    let result = await processor.use(plugin).process(input, { from, to });

    expect(result.css).toMatchSnapshot();
    expect(processor.plugins[0].postcssPlugin).toBe(name);
  });
});
