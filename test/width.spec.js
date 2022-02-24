import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import plugin from '../src';

let from, to;

describe('width:', () => {
  test('auto keyword', () => {
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

  test('thin keyword', () => {
    let input = stripIndent`
      .test {
        scrollbar-width: thin;
      }
    `;

    return postcss([plugin()])
      .process(input, { from, to })
      .then(result => {
        expect(result.css).toMatchSnapshot();
      });
  });

  test('none keyword', () => {
    let input = stripIndent`
      .test {
        scrollbar-width: none;
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
        scrollbar-width: 1rem;
      }
    `;

    let result = await postcss().use(plugin).process(input, { from, to });

    expect(result.css).toMatchSnapshot();
    expect(result.messages.length).toBeGreaterThan(0);
    expect(result.messages[0].type).toBe('warning');
    expect(result.messages[0].text).toMatch(
      /Invalid value for property `scrollbar-width`/
    );
  });
});
