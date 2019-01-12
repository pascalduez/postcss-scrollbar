import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default {
  plugins: [json(), babel()],
  external: ['postcss', 'postcss-selector-parser', 'postcss-value-parser'],
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'esm',
    },
  ],
};
