const CLASS_NAME_SPACE = 'uni';

/**
 * @description 返回一个字符串，该字符串是传入的所有类名连接起来，每个类名前面加上指定的命名空间。
 * @param args 需要连接的类名数组，可以是任意多个。
 * @returns 返回一个包含所有类名的字符串，每个类名前面都加上了指定的命名空间。
 */
export function classNs(...args: string[]) {
    return args.map(className => `${CLASS_NAME_SPACE}-${className}`).join(' ');
}
