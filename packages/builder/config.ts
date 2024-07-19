import path from 'path';
import {Options as EsBuildOptions} from 'rollup-plugin-esbuild';
import {PKG_NAME} from './constance';
import {distPath} from './utils/paths';

/**
 * 将所有的包都打包为 ems 与 cjs
 */
export const buildConfig = {
    esm: {
        format: 'esm',
        path: path.resolve(distPath, 'esm'),
        bundle: {
            path: `${PKG_NAME}/esm`,
        },
    },
    cjs: {
        format: 'cjs',
        path: path.resolve(distPath, 'cjs'),
        bundle: {
            path: `${PKG_NAME}/cjs`,
        },
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
