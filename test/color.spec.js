import postcss from 'postcss';
import { stripIndent } from 'common-tags';
import plugin from '../src';

let from, to;
let run = input => postcss().use(plugin).process(input, { from, to });

describe('color:', () => {
  test('<color> <color>', async () => {
    let input = stripIndent`
      .test {
        scrollbar-color: rebeccapurple green;
      }
    `;

    let result = await run(input);
    expect(result.css).toMatchSnapshot();
  });

  test('keyword', async () => {
    let input = stripIndent`
      .test {
        scrollbar-color: dark;
      }
    `;

    let result = await run(input);
    expect(result.css).toMatchSnapshot();
  });

  test('functional color', async () => {
    let input = stripIndent`
      .test {
        scrollbar-color: rgb(255, 0, 0) transparent;
      }
    `;

    let result = await run(input);
    expect(result.css).toMatchSnapshot();
  });

  test('erroneous keyword', async () => {
    let input = stripIndent`
      .test {
        scrollbar-color: blue;
      }
    `;

    let result = await run(input);

    expect(result.css).toMatchSnapshot();
    expect(result.messages.length).toBeGreaterThan(0);
    expect(result.messages[0].type).toBe('warning');
    expect(result.messages[0].text).toMatch(
      /Invalid value for property `scrollbar-color`/
    );
  });
});
