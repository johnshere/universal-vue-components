// 编译的目标版本是否是 Vue2
export const IS_VUE2 = process.env.VUE_VERSION === '2';

// 发布到 npm 上的包名
export const PKG_NAME = `@esunr/uni-comps-vue${process.env.VUE_VERSION}`;
