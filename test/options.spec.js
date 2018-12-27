import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import plugin from '../src';

let from, to;

describe('options: ', () => {
  test('default options', () => {
    let input = stripIndent`
      .test {
        scrollbar-width: auto;
      }
    `;

    return postcss([plugin()])
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });

  test('with options', () => {
    let input = stripIndent`
      .test {
        scrollbar-width: none;
      }
    `;

    return postcss([plugin({ edgeAutohide: true })])
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });
});
