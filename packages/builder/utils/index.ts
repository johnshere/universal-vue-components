import fs from 'fs';
import path from 'path';

export const withTaskName = <T>(name: string, fn: T) =>
    Object.assign(fn as any, {displayName: name});

export const excludeFiles = (files: string[]) => {
    const excludes = ['node_modules', 'test', 'mock', 'gulpfile', 'dist'];
    return files.filter(
        path => !excludes.some(exclude => path.includes(exclude))
    );
};

/** 递归创建目录 */
export function mkdirSync(dirname: string) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    if (mkdirSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
    }
    return false;
}
