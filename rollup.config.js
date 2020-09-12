import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import copy from 'rollup-plugin-copy';
import typescript from '@rollup/plugin-typescript';

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
      removeAttributeQuotes: false,
    },
  },
};

const filesizeConfig = {
  showGzippedSize: true,
  showBrotliSize: false,
  showMinifiedSize: false,
};

const copyConfig = {
  targets: [
    { src: 'node_modules/@webcomponents', dest: 'dist/node_modules' },
    {
      src: 'node_modules/systemjs/dist/s.min.js',
      dest: 'dist/node_modules/systemjs/dist',
    },
    { src: 'assets', dest: 'dist' },
    { src: 'src/index.html', dest: 'dist' },
  ],
};

const inputFiles = ['src/components/app-root.ts'];

const configs = [
  // The main JavaScript bundle for modern browsers that support
  // JavaScript modules and other ES2015+ features.
  {
    input: inputFiles,
    output: {
      dir: 'dist',
      format: 'esm',
    },
    plugins: [typescript(), minifyHTML(minifyHTMLLiteralsConfig), resolve()],
    preserveEntrySignatures: false,
  },
  // The main JavaScript bundle for older browsers that don't support
  // JavaScript modules or ES2015+.
  {
    input: inputFiles,
    output: {
      dir: 'dist/nomodule',
      format: 'system',
    },
    plugins: [
      typescript(),
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
    input: 'src/polyfills/babel-polyfills-nomodule.ts',
    output: {
      dir: 'dist/nomodule',
      format: 'iife',
    },
    plugins: [
      typescript(),
      commonjs({ include: ['node_modules/**'] }),
      resolve(),
    ],
  },
];

for (const config of configs) {
  if (process.env.NODE_ENV !== 'development') {
    config.plugins.push(terser());
  }
  config.plugins.push(filesize(filesizeConfig));
}

export default configs;
