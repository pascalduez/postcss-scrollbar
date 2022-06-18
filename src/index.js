/* eslint-disable consistent-return */

import selectorParser from 'postcss-selector-parser';
import valueParser from 'postcss-value-parser';
import { name } from '../package.json';

function postcssScrollbar({ width = '8px', edgeAutohide = false } = {}) {
  const widthMap = {
    none: '0',
    auto: 'initial',
    thin: width,
  };

  const colorMap = {
    auto: 'initial',
    dark: 'initial',
    light: 'initial',
  };

  function processWidth(decl, { result, Rule, Declaration }) {
    let { parent, value: keyword } = decl;
    let root = parent.parent;

    if (!isValidWidth(keyword)) {
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

    let newRule = new Rule({
      selector: processor.processSync(parent.selector),
    });

    newRule.append(
      new Declaration({
        prop: 'width',
        value: widthMap[keyword],
      }),
      new Declaration({
        prop: 'height',
        value: widthMap[keyword],
      })
    );

    root.insertBefore(parent, newRule);

    let value = do {
      if (edgeAutohide) {
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

  function processColor(decl, { result, Rule, Declaration }) {
    let { nodes } = valueParser(decl.value);

    if (isInvalidColor(nodes)) {
      return decl.warn(
        result,
        'Invalid value for property `scrollbar-color`. ' +
          'Must be one of `auto | dark | light | <color> <color>`.',
        { word: nodes[0].value }
      );
    }

    function getColorValue(node) {
      if (colorMap[node.value]) {
        return colorMap[node.value]
      }

      if (node.type === 'word') {
        return node.value
      }

      if (node.type === 'function') {
        return decl.value.slice(node.sourceIndex, node.sourceEndIndex)
      }
    }

    let values = nodes
      .filter(value => value.type === 'word' || value.type === 'function')
      .reduce((acc, curr, idx) => {
        if (idx >= 1) {
          return {
            ...acc,
            track: getColorValue(curr),
            corner: getColorValue(curr),
          };
        }

        return {
          thumb: getColorValue(curr),
          track: getColorValue(curr),
          corner: getColorValue(curr),
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

      let newRule = new Rule({
        selector: processor.processSync(parent.selector),
      }).append(
        new Declaration({
          prop: 'background-color',
          value: values[pseudo],
        })
      );

      root.insertBefore(parent, newRule);
    });
  }

  return {
    postcssPlugin: name,
    Declaration: {
      'scrollbar-width': processWidth,
      'scrollbar-color': processColor,
    },
  };
}

function isValidWidth(keyword) {
  return /auto|thin|none/.test(keyword);
}

function isInvalidColor(nodes) {
  return (
    Array.isArray(nodes) &&
    nodes.length === 1 &&
    !/auto|dark|light/.test(nodes[0].value)
  );
}

postcssScrollbar.postcss = true;

export default postcssScrollbar;
