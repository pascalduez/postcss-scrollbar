/* eslint-disable consistent-return */

import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';
import { name } from '../package.json';

export default postcss.plugin(name, () => (css, result) => {
  css.walkDecls(/^scrollbar/, decl => {
    if (decl.prop === 'scrollbar-width') {
      return processWidth(decl, result);
    }

    if (decl.prop === 'scrollbar-color') {
      return processColor(decl, result);
    }
  });
});

function processWidth(decl, result) {
  let { parent, value: keyword } = decl;
  let root = parent.parent;
  let widthMap = {
    auto: 'initial',
    thin: '0.5rem',
    none: '0',
  };

  if (!/auto|thin|none/.test(keyword)) {
    return decl.warn(
      result,
      'Invalid value for property `scrollbar-width`. ' +
        'Must be one of `auto | thin | none`.',
      { word: keyword }
    );
  }

  let processor = selectorParser(selectors => {
    selectors.each(selector => {
      selector.append(
        selectorParser.pseudo({
          value: '::-webkit-scrollbar',
        })
      );
    });
  });

  let newRule = postcss
    .rule({
      selector: processor.processSync(parent.selector),
    })
    .append(
      postcss.decl({
        prop: 'width',
        value: widthMap[keyword],
      })
    );

  root.insertBefore(parent, newRule);

  if (keyword === 'none') {
    decl.insertBefore(decl, {
      prop: '-ms-overflow-style',
      value: '-ms-autohiding-scrollbar;',
    });
  }
}

function processColor(decl, result) {
  let { nodes } = valueParser(decl.value);

  if (nodes.length === 1 && !/auto|dark|light/.test(nodes[0].value)) {
    return decl.warn(
      result,
      'Invalid value for property `scrollbar-color`. ' +
        'Must be one of `auto | dark | light | <color> <color>`.',
      { word: nodes[0].value }
    );
  }

  let colorMap = {
    auto: 'initial',
    dark: 'initial',
    light: 'initial',
  };

  let values = nodes
    .filter(value => value.type === 'word')
    .reduce((acc, curr, idx) => {
      if (idx >= 1) {
        return {
          ...acc,
          track: colorMap[curr.value] || curr.value,
        };
      }

      return {
        thumb: colorMap[curr.value] || curr.value,
        track: colorMap[curr.value] || curr.value,
      };
    }, {});

  let { parent } = decl;
  let root = parent.parent;

  Object.keys(values).map(pseudo => {
    let processor = selectorParser(selectors => {
      selectors.each(selector => {
        selector.append(
          selectorParser.pseudo({
            value: `::-webkit-scrollbar-${pseudo}`,
          })
        );
      });
    });

    let newRule = postcss
      .rule({
        selector: processor.processSync(parent.selector),
      })
      .append(
        postcss.decl({
          prop: 'background-color',
          value: values[pseudo],
        })
      );

    root.insertBefore(parent, newRule);
  });
}
