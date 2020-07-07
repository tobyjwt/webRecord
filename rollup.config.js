import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
    input: 'src/index.js',
    output: {
        name: 'webRecord',
        file: 'dist/web-record.cjs.js',
        format: 'cjs',
        globals: {
            // 包名: 全局用到的变量
            rrweb: 'rrweb',
            axios: 'axios',
            'lz-string': 'lzstring'
        }
    },
    external: ['rrweb', 'lz-string', 'axios'],
    plugins: [
        resolve(),
        commonjs(),
        babel({
            exclude: ['node_modules/**']
        })
    ]
};
