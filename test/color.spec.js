import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import plugin from '../src';

let from, to;

describe('color: ', () => {
  test('<color> <color>', () => {
    let input = stripIndent`
      .test {
        scrollbar-color: rebeccapurple green;
      }
    `;

    return postcss([plugin()])
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });

  test('keyword', () => {
    let input = stripIndent`
      .test {
        scrollbar-color: dark;
      }
    `;

    return postcss([plugin()])
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });

  test('erroneous keyword', async () => {
    let input = stripIndent`
      .test {
        scrollbar-color: blue;
      }
    `;

    let result = await postcss()
      .use(plugin)
      .process(input, { from, to });

    expect(result.css).toMatchSnapshot();
    expect(result.messages.length).toBeGreaterThan(0);
    expect(result.messages[0].type).toBe('warning');
    expect(result.messages[0].text).toMatch(
      /Invalid value for property `scrollbar-color`/
    );
  });
});
