/**
 * @file 编译入口，采用 gulp 进行流程控制
 */
import consola from 'consola';
import del from 'del';
import figlet from 'figlet';
import {parallel, series} from 'gulp';
import {buildFullBundle} from './builders/full-bundle';
import {buildModules} from './builders/modules';
import {buildStylus, copyStylusSource} from './builders/styles';
import {
    copyTypes,
    generateTypesDefinitions,
} from './builders/types-definitions';
import {withTaskName} from './utils';
import {distPath} from './utils/paths';
import {generatePackageJSON} from './builders/packageJSON';

function logInfo() {
    return new Promise((resolve, reject) => {
        figlet(`Uni Comps Veu${process.env.VUE_VERSION}`, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            consola.log(data);
            resolve(undefined);
        });
    });
}

export default series(
    withTaskName('👋 check vue info', logInfo),
    // 清理目录
    withTaskName('🧹clean dist', () => del(distPath, {force: true})),
    parallel(
        // 构建样式
        withTaskName('💅 build .styl files', buildStylus),
        withTaskName('💅 copy .styl source file', copyStylusSource),
        // 构建组件
        withTaskName('📦︎ build full bundle', buildFullBundle),
        withTaskName('📦︎ build modules', buildModules)
    ),
    // 生成 dts 文件
    withTaskName('🎙 generate types definitions', generateTypesDefinitions),
    parallel(
        // 拷贝 package.json
        withTaskName('📄 generate package.json', generatePackageJSON),
        // 将生成的 types 拷贝到各个模块的目录下
        withTaskName('📄 copy types to each module file', copyTypes)
    )
);
