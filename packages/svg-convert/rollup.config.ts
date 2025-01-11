import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
// import nodeResolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
import { type RollupOptions } from 'rollup'

const config: RollupOptions = {
  input: ['src/index.ts'],
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [typescript(), terser()],
  external: ['commander', 'fast-xml-parser', 'node:path', 'node:fs/promises'],
}

export default config
