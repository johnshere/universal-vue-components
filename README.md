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

构建所有内容：

```sh
pnpm run build
```

发布内容，执行后按照 cli 指令操作：

```sh
pnpm run publish
```

> 发布完成后 version.json 会发生变更，务必提交到 git 仓库。

## 3. 组件调试

可以直接使用 playground 模块调试组件源码：

```sh
pnpm dev:vue2 # vue2 模式
pnpm dev:vue3 # vue3 模式
```

如果想要测试组件发布后的结果，除了发布 prerelease 之外，还可以使用 pnpm link 进行本地调试，流程如下：



## 4. 使用发布后的组件

[传送门](./doc/comps-doc.md)

## 5. 组建开发规范

[传送门](./doc/dev-rules.md)

## 6. Q&A

[传送门](./doc/Q&A.md)
