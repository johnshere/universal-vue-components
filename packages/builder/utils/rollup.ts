
/* eslint-disable @typescript-eslint/no-require-imports */

import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import vue3 from '@vitejs/plugin-vue';
import vue2 from '@vitejs/plugin-vue2';
import path from 'path';
import esbuild from 'rollup-plugin-esbuild';
import replace from '@rollup/plugin-replace';
import * as vue2Compiler from 'vue2/compiler-sfc';
import * as vue3Compiler from 'vue3/compiler-sfc';
import {esbuildConfig, nodeResolveExt} from '../config';
import {IS_VUE2, PKG_NAME} from '../constance';
import {compsSrcPath} from './paths';

function getPackageDependencies(
    pkgPath: string
): Record<'dependencies' | 'peerDependencies', string[]> {
    const manifest = require(pkgPath);
    const {dependencies = {}, peerDependencies = {}} = manifest;
    return {
        dependencies: Object.keys(dependencies),
        peerDependencies: Object.keys(peerDependencies),
    };
}

export const generateExternal = async (options: {full: boolean}) => {
    const {dependencies, peerDependencies} = getPackageDependencies(
        path.resolve(compsSrcPath, 'package.json')
    );

    return (id: string) => {
        const packages: string[] = peerDependencies;
        if (!options.full) {
            packages.push('vue', '@vue', ...dependencies);
        }

        return [...new Set(packages)].some(
            pkg => id === pkg || id.startsWith(`${pkg}/`)
        );
    };
};

/**
 * 样式文件单独处理引入方式，只做简单的路径转换
 * 这里的作用类似于 webpack 的 null-loader
 */
function styleModuleResolver() {
    return {
        name: 'style-module-resolver',
        resolveId(id: string) {
            if (!/.(styl|stylus|css)$/.test(id)) {
                return;
            }
            return {
                id: id.replace(/@src\//g, `${PKG_NAME}/`),
                external: 'absolute',
            };
        },
    };
}

/**
 * 生成 module 和 full-bundle 构建器的通用插件配置
 */
export function generateCommonPluginConfig() {
    return [
        replace({
            'process.env.VUE_VERSION': process.env.VUE_VERSION,
        }),
        styleModuleResolver(),
        alias({
            entries: {
                vue: IS_VUE2 ? 'vue2' : 'vue3',
                '@src': compsSrcPath,
            },
        }),
        (IS_VUE2
            ? vue2({
                compiler: vue2Compiler as any,
            })
            : vue3({
                compiler: vue3Compiler as any,
            })) as any,
        nodeResolve({
            extensions: nodeResolveExt,
        }),
        commonjs(),
        esbuild(esbuildConfig),
    ];
}
