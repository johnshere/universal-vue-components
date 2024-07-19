/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';
import {mkdirSync} from '../utils';
import {distPath, compsSrcPath} from '../utils/paths';

const IGNORE_DEPS = ['@vue/tsconfig'];

/**
 * 生成 uni-comps 的 package.json
 */
export async function generatePackageJSON() {
    const basePackageJSON = require(compsSrcPath + '/package.json') as Record<
        string,
        any
    >;
    // 移除 vue 别名
    delete basePackageJSON.dependencies.vue2;
    delete basePackageJSON.dependencies.vue3;
    // 移除不需要的依赖
    IGNORE_DEPS.forEach(dep => {
        delete basePackageJSON.dependencies[dep];
    });
    // 重命名包名
    basePackageJSON.name += `-vue${process.env.VUE_VERSION}`;
    // 合并 _peerDependencies
    Object.assign(
        basePackageJSON.peerDependencies,
        basePackageJSON._peerDependencies,
    );
    delete basePackageJSON._peerDependencies;
    // 写入新的 package.json
    if (!fs.existsSync(distPath)) {
        mkdirSync(distPath);
    }
    fs.writeFileSync(
        path.join(distPath, 'package.json'),
        JSON.stringify(basePackageJSON, null, 4),
    );
}
