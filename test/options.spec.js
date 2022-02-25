import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import plugin from '../src';

let from, to;

describe('options:', () => {
  test('default options', () => {
    let input = stripIndent`
      .test {
        scrollbar-width: auto;
      }
    `;

    return postcss()
      .use(plugin)
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });

  test('the `width` options', () => {
    let input = stripIndent`
      .test {
        scrollbar-width: thin;
      }
    `;

    return postcss()
      .use(plugin({ width: '11px' }))
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });

  test('the `edgeAutohide` options', () => {
    let input = stripIndent`
      .test {
        scrollbar-width: none;
      }
    `;

    return postcss()
      .use(plugin({ edgeAutohide: true }))
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });
});
