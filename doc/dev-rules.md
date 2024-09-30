### 开发步骤简述

1. 在 `/packages/components` 下创建一个新的文件夹用来存放组件源码
2. 创建 `src`，其中包含一个以组件名为命名的 `vue` 文件用来编写 SFC 组件，再创建一个以组建名为命名的 `ts` 文件存放 props 以及组件所需要的 types
3. 创建 `style` 编写样式依赖（具体见样式说明）
4. 创建 `index.ts` 对外导出组件，并为组建创建 install 方法
5. 在 `/packages/components/index.ts` 导出新编写的组件

### 组件开发规范

**目录结构：**

每个组件都独占 `/packages/components` 下的一个文件夹，其单个组件必须包含如下几个目录以及文件：

```
./src
    - components
        - component-a                 # 单个组件占用一个文件夹
            - src                     # 组建的源码文件
                - component-a.vue     # 组件本身
                - component-a.ts      # 组件的 props、props type、instance 都需要单独写入该文件
                - sub-component-a.vue # 当前组建的子组件，不必对外暴露
            - style                   # 组件的样式依赖维护，见下一章节的样式开发规范
                - css.ts
                - index.ts
            - index.ts                # 组件入口，包含一个组件 install 的方法
        - component-b
            - ... ...
        - index.ts                    # 所有组件的入口，编写好一个组件后记得再此对外导出
```

**组件命名：**

- SFC 组件中要使用 `defineComponent` 来为组件定义名称；
- SFC Template 中的顶层 HTMLElement 的 class 需要使用 `classNs` 方法来包裹，避免样式污染；

### 样式开发规范

**目录结构：**

```
./src
    - styles
        - src
            - assets            # 资源类样式表，比如 BmsUserMenu 需要引用的 UcCommonLogin 登录框的样式
            - common            # 通用文件
                - config.styl   # 配置信息，包含命名空间配置、nib 配置，配置文件会自动引入 nib
                - var.styl      # 样式变量
            - mixins
                - mixins.styl
            - index.styl        # 入口文件
            - component-a.styl  # component-a 组件的样式
            - component-b.styl  # component-b 组件的样式
            - ... ...
```

**样式命名：**

- 所有的组件样式都需要放在 `/packages/src/styles/src` 下进行维护，文件名需要严格符合 kebab-case 规范。
- 与 SFC Template 中 class 命名空间对应的，stylus 样式文件中对应顶层 HTMLElement 的 class 名称需要使用 `$ns` 变量前缀，如 `.{$ns}-uni-comp`；


**通用配置引入：**

开发组件样式时，由于编译样式时也使用了 nib 特性，其中 nib 的相关配置在 `common/config.styl` 文件中，**因此无论是否要使用 nib 特性，都要使用 `@import` 引入 `common/config.styl`，否则，打包出来的跨浏览器样式配置会与其他组件不符合**，尤其是 `flex-version` 不使用 `common/config.styl` 的配置会在编译时触发 `postcss-preset-env` 警告。
