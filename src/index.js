/* eslint-disable consistent-return */

import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';
import { name } from '../package.json';

const defaults = {
  edgeAutohide: false,
};

const widthMap = {
  auto: 'initial',
  thin: '0.5rem',
  none: '0',
};

const colorMap = {
  auto: 'initial',
  dark: 'initial',
  light: 'initial',
};

export default postcss.plugin(name, (options = defaults) => (css, result) => {
  css.walkDecls(/^scrollbar/, decl => {
    if (decl.prop === 'scrollbar-width') {
      return processWidth(decl);
    }

    if (decl.prop === 'scrollbar-color') {
      return processColor(decl);
    }
  });

  function processWidth(decl) {
    let { parent, value: keyword } = decl;
    let root = parent.parent;

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

    let value = do {
      if (options.edgeAutohide) {
        ('-ms-autohiding-scrollbar');
      } else if (keyword === 'none') {
        ('none');
      } else {
        ('auto');
      }
    };

    parent.insertBefore(decl, {
      prop: '-ms-overflow-style',
      value,
    });
  }

  function processColor(decl) {
    let { nodes } = valueParser(decl.value);

    if (nodes.length === 1 && !/auto|dark|light/.test(nodes[0].value)) {
      return decl.warn(
        result,
        'Invalid value for property `scrollbar-color`. ' +
          'Must be one of `auto | dark | light | <color> <color>`.',
        { word: nodes[0].value }
      );
    }

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

    Object.keys(values).forEach(pseudo => {
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
});
