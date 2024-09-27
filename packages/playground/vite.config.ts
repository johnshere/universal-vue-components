import {defineConfig} from 'vite';
import vue2 from '@vitejs/plugin-vue2';
import vue3 from '@vitejs/plugin-vue';
import * as vue2Compiler from 'vue2/compiler-sfc';
import * as vue3Compiler from 'vue3/compiler-sfc';
import path from 'path';

const IS_VUE2 = process.env.VITE_VUE_VERSION === '2';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        IS_VUE2
            ? vue2({
                  compiler: vue2Compiler as any,
              })
            : vue3({
                  compiler: vue3Compiler,
              }),
        {
            name: 'html-rewriter',
            transformIndexHtml(html: string) {
                return html.replace(/%VUE_VERSION%/g, IS_VUE2 ? '2' : '3');
            },
        },
    ],
    resolve: {
        alias: {
            vue: IS_VUE2 ? 'vue2' : 'vue3',
            '@': path.resolve(__dirname, './src/'),
            '@src': path.resolve(__dirname, '../src/'),
        },
    },
});
