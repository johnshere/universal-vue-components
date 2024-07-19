# Universal Vue Components

## 0. 背景

团队内同时存在 Vue2 与 Vue3 的项目，因此需要考虑组件如何在不同版本的 Vue 之间实现复用。Vue2.7 已经支持了 setup 写法以及 Composition API，这使得 SFC 可以在 Vue2 与 Vue3 之间通用称为可能。

但由于 Vue2 与 Vue3 的 Compiler 不同，虽然使用 setup 编写的 SFC 文件（.vue 文件）可以复用，编译后的 JS 文件却是没法通用的（比如 Vue2 没有 `createElementVNode` 这样的运行时 API）。所以组件发布就只能发布原始的 SFC 文件，然后交由使用方项目内部的 webpack、vite 进行编译，这样本质上只是将代码互相拷贝而已。这种方式就存在很大的弊端，比如：

- SFC 组件的编译完全依赖于使用方的编译器，在不同的项目环境下可能会出错；
- 源码中的 alias 的解析需要依赖适用方，这不合理；
- 旧的项目没有 ts 编译器，所以不能使用 Typescript 编写组件；

本项目目标 & 特性：

- 使用 SCF + Composition API + Typescript 编写组件；
- 编写一套代码，同时编译出 Vue2、Vue3 两个版本的组件库，告别组件不通用的烦恼；
- 编译后会生成组件的声明文件，使旧项目也能享受到类型提示；

## 1. 目录结构

```
.
├── README.md
├── eslint.config.mjs
├── package.json
├── packages
│   ├── builder             # 组件库构建代码
│   ├── config              # 模块间的通用配置
│   ├── playground          # 组件调试
│   ├── src                 # 组建源码
│   └── utils               # 模块间的通用方法
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── stylelint.config.mjs
└── version.json            # 用于记录发包的版本信息
```

## 2. 构建与发布

使用 playground 模块调试组件：

```sh
pnpm dev:vue2 # vue2 模式
pnpm dev:vue3 # vue3 模式
```

构建所有内容：

```sh
pnpm run build
```

发布内容，执行后按照 cli 指令操作：

```sh
pnpm run publish
```

> 发布完成后 version.json 会发生变更，务必提交到 git 仓库。

## 2. 组件使用

```ts
// 引入组件 (vue2)：
import {UniComp} from "@esunr/uni-comps-vue2"
// 引入组件 (vue3)：
import {UniComp} from "@esunr/uni-comps-vue3"
```

## 3. 开发规范

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

## 4. Q&A

### pnpm install 时出现依赖警告？

```
packages/vr-components/playground
└─┬ @vitejs/plugin-vue2 2.3.1
  └── ✕ unmet peer vue@^2.7.0-0: found 3.4.29
```

这由于 playground 需要支持切换 vue2 和 vue3 两种编译模式，所以是通过别名来安装的 vue2 和 vue3，所以会导致无法正确自动索引到 vue 的相关依赖。已对过 vite 配置对编译器进行了手动指定 vue 版本来使其正常工作，因此无需关注。
