/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';
import {mkdirSync} from '../utils';
import {distPath, compsSrcPath} from '../utils/paths';
import {PKG_NAME} from '../utils/constance';

const IGNORE_DEPS = ['vue2', 'vue3', '@vue3/shared'];

/**
 * 生成 uni-comps 的 package.json
 */
export async function generatePackageJSON() {
    const packageJSONPath = path.join(compsSrcPath, 'package.json');
    const basePackageJSON = require(packageJSONPath) as Record<string, any>;
    // 移除不需要的依赖
    if (basePackageJSON.dependencies) {
        IGNORE_DEPS.forEach(dep => {
            delete basePackageJSON.dependencies[dep];
        });
    }
    // 重命名包名
    basePackageJSON.name = PKG_NAME;
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
    // 清除 require 缓存
    delete require.cache[require.resolve(packageJSONPath)];
}
