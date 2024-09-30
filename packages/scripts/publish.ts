/* eslint-disable @typescript-eslint/no-require-imports */
import {select} from '@inquirer/prompts';
import {VUE2_PKG_NAME, VUE3_PKG_NAME} from '@shared/config/constance';
import {PROJECT_OUTPUT_PATH, PROJECT_ROOT_PATH} from '@shared/config/paths';
import {genNextVersion, getVersion, recordVersion} from '@shared/utils';
import chalk from 'chalk';
import consola from 'consola';
import execa from 'execa';
import fs from 'fs';
import path from 'path';

const DEPLOY_PACKAGES: {name: string; path: string; version: string}[] = [
    {
        name: VUE2_PKG_NAME,
        path: path.join(PROJECT_OUTPUT_PATH, VUE2_PKG_NAME),
        version: getVersion(VUE2_PKG_NAME),
    },
    {
        name: VUE3_PKG_NAME,
        path: path.join(PROJECT_OUTPUT_PATH, VUE3_PKG_NAME),
        version: getVersion(VUE3_PKG_NAME),
    },
];

const VERSION_OPTIONS = ['prerelease', 'patch', 'minor', 'major'] as const;

/**
 * 主执行函数
 */
async function main() {
    const publishType = await select({
        message: '请选择发布的内容',
        choices: [
            ...DEPLOY_PACKAGES.map(item => {
                const version = item.version;
                const spaces = new Array(30 - item.name.length)
                    .fill(' ')
                    .join('');
                return {
                    name: `${item.name}` + spaces + `(version: ${version})`,
                    value: item.name,
                };
            }),
            {
                name: 'all',
                value: 'all',
            },
            {
                name: chalk.red('退出发布'),
                value: 'exit',
            },
        ],
    });

    switch (publishType) {
        // 发布 npm 包
        case VUE2_PKG_NAME:
        case VUE3_PKG_NAME:
            await publishNpmPackage(publishType);
            break;
        // 合并发布 uni-comps-vue2 和 uni-comps-vue3
        case 'all':
            await publishComponents();
            break;
        case 'exit':
            consola.info('脚本已退出');
    }
}

main();

/**
 * 发布 npm 包
 */
async function publishNpmPackage(packageName: string, version?: string) {
    const pkgInfo = DEPLOY_PACKAGES.find(item => item.name === packageName);
    if (!pkgInfo) {
        throw new Error(`DEPLOY_PACKAGES 无法找到 ${packageName} 相关的信息`);
    }
    const pkgPath = pkgInfo.path;
    if (!fs.existsSync(pkgPath)) {
        throw new Error(`无法查找到 ${pkgPath} 目录，请确认是否已经编译出内容`);
    }
    const pkgJSON = require(path.join(pkgPath, 'package.json'));
    if (!pkgJSON) {
        throw new Error(`无法查找到 ${packageName} 对应的 package.json`);
    }

    // 覆写版本号
    const currentPkgVersion = getVersion(packageName);
    let selectedVersion = version;
    if (!selectedVersion) {
        selectedVersion = (await select({
            message: `请选择包版本的升级类型（当前版本：${currentPkgVersion}）`,
            choices: VERSION_OPTIONS.map(key => {
                const nextVersion = genNextVersion(currentPkgVersion, key);
                return {
                    name: key,
                    value: nextVersion,
                    description: `选择此选项后，将生成的新版本号：${nextVersion}`,
                };
            }),
        })) as string;
    }
    pkgJSON.version = selectedVersion;
    fs.writeFileSync(
        path.join(pkgPath, 'package.json'),
        JSON.stringify(pkgJSON, null, 4),
    );

    // 执行 npm 发布指令
    execa.commandSync(`pnpm publish --access public --no-git-checks`, {
        cwd: pkgPath,
        stdio: 'inherit',
    });

    // 记录版本值
    recordVersion(packageName, selectedVersion);

    // 还原版本号
    pkgJSON.version = '0.0.0';
    fs.writeFileSync(
        path.join(pkgPath, 'package.json'),
        JSON.stringify(pkgJSON, null, 4),
    );

    consola.success(
        `🥳 ${packageName} 发布成功，版本号：${chalk.green(selectedVersion)}`,
    );
}

/**
 * 合并发布 uni-comps-vue2 和 uni-comps-vue3
 */
async function publishComponents() {
    buildComponents();
    const vue2PkgInfo = DEPLOY_PACKAGES.find(
        item => item.name === VUE2_PKG_NAME,
    );
    const vue3PkgInfo = DEPLOY_PACKAGES.find(
        item => item.name === VUE3_PKG_NAME,
    );
    if (!vue2PkgInfo || !vue3PkgInfo) {
        throw new Error(
            `DEPLOY_PACKAGES 无法找到 ${VUE2_PKG_NAME} 或 ${VUE3_PKG_NAME} 相关的信息`,
        );
    }
    if (
        !fs.existsSync(path.resolve(vue2PkgInfo.path)) ||
        !fs.existsSync(path.resolve(vue3PkgInfo.path))
    ) {
        throw new Error(
            `未同时找到 ${VUE2_PKG_NAME} 与 ${VUE3_PKG_NAME} 目录，请确认是否已经编译出内容`,
        );
    }

    const selectedVersion = (await select({
        message: '请选择包版本的升级类型：',
        choices: VERSION_OPTIONS.map(key => {
            const nextVue2Version = genNextVersion(vue2PkgInfo.version, key);
            const nextVue3Version = genNextVersion(vue3PkgInfo.version, key);
            return {
                name: key,
                value: `${nextVue2Version}|${nextVue3Version}`,
                description:
                    `当前版本号：${VUE2_PKG_NAME}@${chalk.red(vue2PkgInfo.version)}, ` +
                    `${VUE3_PKG_NAME}@${chalk.red(vue3PkgInfo.version)}` +
                    '\n' +
                    `选择此选项后，将生成的新版本号：${VUE2_PKG_NAME}@${chalk.red(nextVue2Version)}, ` +
                    `${VUE3_PKG_NAME}@${chalk.red(nextVue3Version)}`,
            };
        }),
    })) as string;
    const [nextVue2Version, nextVue3Version] = selectedVersion.split('|');
    await publishNpmPackage(VUE2_PKG_NAME, nextVue2Version);
    await publishNpmPackage(VUE3_PKG_NAME, nextVue3Version);
}

/** 构建组件库 */
function buildComponents() {
    consola.info('正在构建组件');
    execa.commandSync('pnpm run build', {
        cwd: PROJECT_ROOT_PATH,
        stdio: 'inherit',
    });
}
