/* eslint-disable @typescript-eslint/no-require-imports */
import {select} from '@inquirer/prompts';
import {PROJECT_OUTPUT_PATH, PROJECT_ROOT_PATH} from '@shared/config/paths';
import {genNextVersion, getVersion, recordVersion} from '@shared/utils';
import chalk from 'chalk';
import consola from 'consola';
import fs from 'fs';
import path from 'path';
import execa from 'execa';

const DEPLOY_PACKAGE_MAP = {
    '@esunr/uni-comps-vue2': {
        path: path.join(PROJECT_OUTPUT_PATH, 'uni-comps-vue2'),
        version: getVersion('@esunr/uni-comps-vue2'),
    },
    '@esunr/uni-comps-vue3': {
        path: path.join(PROJECT_OUTPUT_PATH, 'uni-comps-vue3'),
        version: getVersion('@esunr/uni-comps-vue2'),
    },
} as const;

type DeployPackageName = keyof typeof DEPLOY_PACKAGE_MAP;

const VERSION_OPTIONS = ['prerelease', 'patch', 'minor', 'major'] as const;

/**
 * 主执行函数
 */
async function main() {
    const publishType = (await select({
        message: '请选择发布的内容',
        choices: [
            ...Object.keys(DEPLOY_PACKAGE_MAP)
                // 不允许 vr-components 独立发包，要发就必须 vue2 和 vue3 一起发
                .filter(key => !key.includes('@esunr/uni-comps-vue'))
                .map(key => {
                    const version =
                        DEPLOY_PACKAGE_MAP[key as DeployPackageName].version;
                    const spaces = new Array(30 - key.length)
                        .fill(' ')
                        .join('');
                    return {
                        name: `${key}` + spaces + `(version: ${version})`,
                        value: key,
                    };
                }),
            {
                name: '@esunr/uni-comps-vue*',
                value: '@esunr/uni-comps-vue*',
            },
            {
                name: chalk.red('退出发布'),
                value: 'exit',
            },
        ],
    })) as DeployPackageName | '@esunr/uni-comps-vue*' | 'exit';

    switch (publishType) {
        // 发布 npm 包
        case '@esunr/uni-comps-vue2':
        case '@esunr/uni-comps-vue3':
            await publishNpmPackage(publishType);
            break;
        // 合并发布 uni-comps-vue2 和 uni-comps-vue3
        case '@esunr/uni-comps-vue*':
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
async function publishNpmPackage(
    packageName: keyof typeof DEPLOY_PACKAGE_MAP,
    version?: string,
) {
    const pkgPath = DEPLOY_PACKAGE_MAP[packageName].path;
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
    if (
        !fs.existsSync(
            path.resolve(DEPLOY_PACKAGE_MAP['@esunr/uni-comps-vue2'].path),
        ) ||
        !fs.existsSync(
            path.resolve(DEPLOY_PACKAGE_MAP['@esunr/uni-comps-vue3'].path),
        )
    ) {
        throw new Error(
            '未同时找到 @esunr/uni-comps-vue2 与 @esunr/uni-comps-vue2 目录，请确认是否已经编译出内容',
        );
    }

    const vrCompsVue2Version = getVersion('@esunr/uni-comps-vue2');
    const vrCompsVue3Version = getVersion('@esunr/uni-comps-vue3');

    const selectedVersion = (await select({
        message: '请选择包版本的升级类型：',
        choices: VERSION_OPTIONS.map(key => {
            const nextVue2Version = genNextVersion(vrCompsVue2Version, key);
            const nextVue3Version = genNextVersion(vrCompsVue3Version, key);
            return {
                name: key,
                value: `${nextVue2Version}|${nextVue3Version}`,
                description:
                    `当前版本号：vr-components-vue2@${chalk.red(vrCompsVue2Version)}, ` +
                    `vr-components-vue3@${chalk.red(vrCompsVue3Version)}` +
                    '\n' +
                    `选择此选项后，将生成的新版本号：vr-components-vue2@${chalk.red(nextVue2Version)}, ` +
                    `vr-components-vue3@${chalk.red(nextVue3Version)}`,
            };
        }),
    })) as string;
    const [nextVue2Version, nextVue3Version] = selectedVersion.split('|');
    await publishNpmPackage('@esunr/uni-comps-vue2', nextVue2Version);
    await publishNpmPackage('@esunr/uni-comps-vue3', nextVue3Version);
}

/** 构建组件库 */
function buildComponents() {
    consola.info('正在构建组件');
    execa.commandSync('pnpm run build', {
        cwd: PROJECT_ROOT_PATH,
        stdio: 'inherit',
    });
}
