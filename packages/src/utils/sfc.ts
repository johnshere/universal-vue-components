export type SFCWithInstall<T> = T & {
    install: (app: any) => void;
};

/**
 * 为组件扩展 install 方法，使是组件可以通过 app.use(component) 的方式使用
 * @param comp
 */
export const withInstall = <T>(comp: T) => {
    (comp as SFCWithInstall<T>).install = function (app) {
        app.component((comp as any).name, comp as any);
    };
    return comp as SFCWithInstall<T>;
};
