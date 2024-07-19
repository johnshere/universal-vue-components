export let VUE_VERSION = '2';

// rollup inject
try {
    // @ts-ignore
    VUE_VERSION = process.env.VUE_VERSION as string;
}
catch {
    // don't throw error
}

// vite inject
try {
    // @ts-ignore
    VUE_VERSION = (import.meta as any).env.VITE_VUE_VERSION;
}
catch {
    // don't throw error
}

/** 判断是否是 Vue2 环境 */
export const IS_VUE2 = VUE_VERSION === '2';
