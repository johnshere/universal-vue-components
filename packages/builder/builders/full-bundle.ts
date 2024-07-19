import path from 'path';
import {OutputOptions, rollup, RollupOptions} from 'rollup';
import {distPath, entryFilePath} from '../utils/paths';
import {generateCommonPluginConfig, generateExternal} from '../utils/rollup';

/**
 * 构建全量包，将组件打包到一个 js 下
 */
export async function buildFullBundle() {
    const rollupOption: RollupOptions = {
        input: entryFilePath,
        plugins: [...generateCommonPluginConfig()],
        external: await generateExternal({full: true}),
    };

    const outputOptions: OutputOptions[] = [
        {
            format: 'umd',
            file: path.resolve(distPath, 'index.js'),
            name: 'vueUniComps',
            exports: 'named',
            globals: {
                vue: 'Vue',
            },
        },
        {
            format: 'esm',
            file: path.resolve(distPath, 'index.esm.js'),
        },
    ];

    const bundle = await rollup(rollupOption);
    return Promise.all(outputOptions.map(option => bundle.write(option)));
}
