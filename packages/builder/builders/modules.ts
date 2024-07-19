import glob from 'fast-glob';
import {OutputOptions, rollup, RollupOptions} from 'rollup';
import {buildConfig} from '../config';
import {excludeFiles} from '../utils';
import {compsSrcPath} from '../utils/paths';
import {generateCommonPluginConfig, generateExternal} from '../utils/rollup';
/**
 * 构建可以按需引入的 module
 */
export async function buildModules() {
    const input = excludeFiles(
        await glob('**/*.{js,ts,vue}', {
            cwd: compsSrcPath,
            absolute: true,
            onlyFiles: true,
        })
    );

    const rollupOption: RollupOptions = {
        input,
        plugins: [...generateCommonPluginConfig()],
        external: await generateExternal({full: false}),
    };

    const outputOptions = Object.values(buildConfig).map(config => {
        return {
            format: config.format,
            dir: config.path,
            exports: config.format === 'cjs' ? 'named' : undefined,
            preserveModules: true, // 保留原有的目录结构
            // preserveModulesRoot: entryFilePath, // 入口文件的路径，会从 output.dir 中剥离出来
            sourcemap: true,
        } as OutputOptions;
    });

    const bundle = await rollup(rollupOption);
    return Promise.all(outputOptions.map(option => bundle.write(option)));
}
