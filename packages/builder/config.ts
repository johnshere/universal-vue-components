import path from 'path';
import {Options as EsBuildOptions} from 'rollup-plugin-esbuild';
import {distPath} from './utils/paths';

/**
 * 将所有的包都打包为 ems 与 cjs
 */
export const buildConfig = {
    esm: {
        format: 'esm',
        path: path.resolve(distPath, 'esm'),
        ext: 'mjs',
    },
    cjs: {
        format: 'cjs',
        path: path.resolve(distPath, 'cjs'),
        ext: 'js',
    },
};

export type BuildModule = keyof typeof buildConfig;

export const nodeResolveExt = ['.mjs', '.js', '.json', '.ts'];

export const esbuildConfig: EsBuildOptions = {
    sourceMap: true,
    target: 'es2018',
    loaders: {
        '.vue': 'ts',
    },
};
