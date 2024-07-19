# Playground

## 1. 启动

调试 Vue2 环境：

```sh
pnpm dev:vue2
```

调试 Vue3 环境：

```sh
pnpm dev:vue3
```

## 2. 调试组件

### 调试组件源码

```ts
import {UniComp} from '@src/components';
```

### 调试打包好的组件

进入 `output` 中编译后的组件目录并执行 pnpm link：

```sh
cd output/uni-comps-vue2
pnpm link --global
```

进入到 playground 目录下，执行 pnpm link：

```sh
cd packages/playground
pnpm link --global @esunr/vue-uni-comps-vue2
```

调试完成后删除全局链接和本地链接：

```sh
pnpm uninstall @esunr/vue-uni-comps-vue2
pnpm uninstall @esunr/vue-uni-comps-vue2 --global
```
