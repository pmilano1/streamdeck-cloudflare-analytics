import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/plugin.ts',
  output: {
    file: 'com.milanese.cloudflare-analytics.sdPlugin/bin/plugin.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'auto',
    inlineDynamicImports: true
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    }),
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ['node']
    }),
    commonjs()
  ],
  external: []
};

