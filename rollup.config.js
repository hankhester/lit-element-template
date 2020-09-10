/**
 * @license
 * Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';

const babelConfig = {
  babelrc: false,
  ...{
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            ie: '11',
          },
        },
      ],
    ],
  },
};

const minifyHTMLLiteralsConfig = {
  options: {
    minifyOptions: {
      removeAttributeQuotes: false
    }
  }
}

const filesizeConfig = {
  showGzippedSize: true,
  showBrotliSize: false,
  showMinifiedSize: false,
};

const copyConfig = {
  targets: [
    { src: 'node_modules/@webcomponents', dest: 'dist/node_modules' },
    { src: 'node_modules/systemjs/dist/s.min.js', dest: 'dist/node_modules/systemjs/dist' },
    { src: 'assets', dest: 'dist' },
    { src: 'src/index.html', dest: 'dist' },
  ],
};

const configs = [
  // The main JavaScript bundle for modern browsers that support
  // JavaScript modules and other ES2015+ features.
  {
    input: 'tsc-output/components/app-root.js',
    output: {
      dir: 'dist/src/components',
      format: 'esm',
    },
    plugins: [
      minifyHTML(minifyHTMLLiteralsConfig),
      resolve()
    ],
    preserveEntrySignatures: false,
  },
  // The main JavaScript bundle for older browsers that don't support
  // JavaScript modules or ES2015+.
  {
    input: ['tsc-output/components/app-root.js'],
    output: {
      dir: 'dist/nomodule/src',
      format: 'system',
    },
    plugins: [
      minifyHTML(minifyHTMLLiteralsConfig),
      commonjs({ include: ['node_modules/**'] }),
      babel(babelConfig),
      resolve(),
      copy(copyConfig),
    ],
    preserveEntrySignatures: false,
  },
  // Babel polyfills for older browsers that don't support ES2015+.
  {
    input: 'tsc-output/babel-polyfills-nomodule.js',
    output: {
      file: 'dist/nomodule/src/babel-polyfills-nomodule.js',
      format: 'iife',
    },
    plugins: [commonjs({ include: ['node_modules/**'] }), resolve()],
  },
];

for (const config of configs) {
  if (process.env.NODE_ENV !== 'development') {
    config.plugins.push(terser());
  }
  config.plugins.push(filesize(filesizeConfig));
}

export default configs;