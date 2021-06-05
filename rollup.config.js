import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import { terser } from 'rollup-plugin-terser';
import dotenv from 'dotenv';

const isProduction = (process.env.NODE_ENV === 'PRODUCTION');

dotenv.config({
  path: isProduction ? './.env.prod' : './.env.dev'
});

const configs = [
  {
    input: 'sources/script.js',
    output: {
      file: 'dist/script.js',
      format: 'umd',
      sourcemap: !isProduction
    },
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.WYBORNIK_API': JSON.stringify(process.env.WYBORNIK_API),
        'process.env.WYBORNIK_MAIL': JSON.stringify(process.env.WYBORNIK_MAIL),
        'process.env.WYBORNIK_LOCAL': JSON.stringify(process.env.WYBORNIK_LOCAL),
        'process.env.WYBORNIK_TYPE_IMAGE': JSON.stringify(process.env.WYBORNIK_TYPE_IMAGE)
      }),
      isProduction && terser(),
      copy({
        targets: [
          { src: 'sources/index.html', dest: 'dist/' },
          { src: 'sources/style.css', dest: 'dist/' },
          { src: 'sources/images.json', dest: 'dist/' },
        ]
      }),
      !isProduction && serve({ open: true, contentBase: ['dist', 'sources', 'images'] }),
      !isProduction && livereload(),
    ],
  },
];

export default configs;